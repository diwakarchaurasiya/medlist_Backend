const Payment = require('../models/payment_model');
const Appointment = require('../models/appointment_model');

// Utility: Sync payment status on appointment after any change
async function syncAppointmentPaymentStatus(appointmentId) {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return;

    const payments = await Payment.find({ appointment: appointmentId });

    const netAmount = payments.reduce((sum, p) => {
        if (p.paymentStatus === 'Refunded') return sum - p.amount;
        if (p.paymentStatus === 'Completed') return sum + p.amount;
        return sum;
    }, 0);

    let newStatus = 'Pending';
    if (netAmount >= appointment.amount) newStatus = 'Completed';
    if (netAmount <= 0) newStatus = 'Pending';

    await Appointment.findByIdAndUpdate(appointmentId, { paymentStatus: newStatus });
}

// Create a new payment
async function createPayment(req, res) {
    try {
        const {
            appointment,
            patient,
            doctor,
            amount,
            paymentMethod,
            recordedBy
        } = req.body;

        const payment = await Payment.create({
            appointment,
            patient,
            doctor,
            amount,
            paymentMethod,
            recordedBy: recordedBy || req.adminId,
            paymentStatus: 'Completed',
        });

        // Sync appointment payment status
        await syncAppointmentPaymentStatus(appointment);

        res.status(201).json({ message: 'Payment recorded successfully.', payment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create payment.' });
    }
}

// Refund a payment
async function refundPayment(req, res) {
    try {
        const { paymentId } = req.params;

        const updated = await Payment.findByIdAndUpdate(
            paymentId,
            { paymentStatus: 'Refunded' },
            { new: true }
        );

        // Sync appointment status after refund
        await syncAppointmentPaymentStatus(updated.appointment);

        res.json({ message: 'Payment marked as refunded.', payment: updated });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to refund payment.' });
    }
}

// Update only the payment status on appointment
async function updateAppointmentPaymentStatus(req, res) {
    try {
        const { id } = req.params;
        const { paymentStatus } = req.body;

        if (!['Pending', 'Completed', 'Failed', 'Refunded'].includes(paymentStatus)) {
            return res.status(400).json({ message: 'Invalid payment status value.' });
        }

        const updatedAppointment = await Appointment.findByIdAndUpdate(
            id,
            { paymentStatus },
            { new: true }
        );

        if (!updatedAppointment) {
            return res.status(404).json({ message: 'Appointment not found.' });
        }

        return res.status(200).json({
            message: 'Payment status updated successfully.',
            appointment: updatedAppointment,
        });
    } catch (error) {
        console.error('Error updating payment status:', error);
        return res.status(500).json({ message: 'Server error while updating status.' });
    }
}

// Get today's payments
async function getTodaysPayments(req, res) {
    try {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(23, 59, 59, 999);

        const payments = await Payment.find({
            paymentDate: { $gte: start, $lte: end },
            paymentStatus: { $in: ['Completed', 'Refunded'] },
        }).populate('patient doctor appointment recordedBy');

        const totalAmount = payments.reduce((total, payment) => {
            if (payment.paymentStatus === 'Refunded') {
                return total - payment.amount;
            }
            return total + payment.amount;
        }, 0);

        res.json({
            today: {
                payments,
                totalAmount,
            },
        });
    } catch (err) {
        console.error('getTodaysPayments error:', err);
        res.status(500).json({ error: 'Failed to fetch today’s payments.' });
    }
}

// Get all payments
async function getAllPayments(req, res) {
    try {
        const payments = await Payment.find()
            .sort({ paymentDate: -1 })
            .populate('patient doctor appointment recordedBy');

        res.json({ payments });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch payments.' });
    }
}

// ✅ Named exports
module.exports = {
    createPayment,
    refundPayment,
    getTodaysPayments,
    getAllPayments,
    updateAppointmentPaymentStatus,
};
