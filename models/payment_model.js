const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
    {
        appointment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Appointment',
            required: true,
            unique: true,
        },
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Patient',
            required: true,
        },
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Doctor',
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        paymentStatus: {
            type: String,
            enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
            default: 'Pending',
        },
        paymentMethod: {
            type: String,
            enum: ['Cash', 'Card', 'Online', 'Other'],
            default: 'Cash',
        },
        paymentDate: {
            type: Date,
            default: Date.now,
        },
        recordedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

paymentSchema.index({ paymentDate: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
