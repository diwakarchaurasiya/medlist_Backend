const Appointment = require('../models/appointment_model'); // Replace with the correct path to your model
const Doctor = require('../models/doctor_model');


// Controller function to create an appointment
async function createAppointment(req, res) {
    const { patientId, doctorId, appointmentDate, appointmentTime, appointmentDay,
        paymentStatus } = req.body;
    console.log(req.body)
    try {
        // Check if all required fields are provided
        if (!patientId || !doctorId || !appointmentDate || !appointmentTime || !appointmentDay) {
            return res.status(400).json({
                message: 'All fields are required.',
            });
        }


        // Check if an appointment already exists for the same doctor, date, and time
        const existingAppointment = await Appointment.findOne({
            doctorId,
            patientId,
            appointmentDate,
            appointmentTime,
        });

        if (existingAppointment) {
            return res.status(401).json({
                message: 'An appointment is already booked with this doctor at the given date and time.',
            });
        }
        // ✅ Fetch the appointment fee from the doctor model
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found.' });
        }

        const appointmentFee = doctor.appointmentFees; // Assuming appointmentFees is a field in the Doctor model
        const newAppointment = await Appointment.create({
            patientId,
            doctorId,
            appointmentDate,
            appointmentTime,
            appointmentDay,
            status: "Scheduled", // Default status
            amount: appointmentFee, // Store fee in the appointment
            paymentStatus: paymentStatus, // initially unpaid
        });

        res.status(201).json({
            message: 'Appointment booked successfully',
            data: newAppointment,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
// Controller function to get all appointments
async function getAllAppointments(req, res) {
    try {
        const appointments = await Appointment.find().populate('patientId doctorId');
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Controller function to update appointment status
async function updateAppointmentStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const updatedAppointment = await Appointment.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedAppointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.status(200).json({
            message: 'Appointment status updated successfully',
            data: updatedAppointment,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// ✅ Get appointments by patient ID
async function getAppointmentsByPatientId(req, res) {
    const { patientId } = req.params;

    try {
        const appointments = await Appointment.find({ patientId })
            .populate("doctorId")
            .sort({ appointmentDate: -1 });

        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// ✅ Get appointments by doctor ID
async function getAppointmentsByDoctorId(req, res) {
    const { doctorId } = req.params;

    try {
        const appointments = await Appointment.find({ doctorId })
            .populate("doctorId")
            .populate("patientId")
            .sort({ appointmentDate: -1 });

        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


// Controller function to delete an appointment
async function deleteAppointment(req, res) {
    const { id } = req.params;

    try {
        const deletedAppointment = await Appointment.findByIdAndDelete(id);

        if (!deletedAppointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.status(200).json({
            message: 'Appointment deleted successfully',
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createAppointment,
    getAllAppointments,
    updateAppointmentStatus,
    deleteAppointment,
    getAppointmentsByPatientId,
    getAppointmentsByDoctorId,
};
