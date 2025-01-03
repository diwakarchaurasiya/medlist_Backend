const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Doctor's name is required"],
        trim: true,
    },
    specialization: {
        type: String,
        required: [true, "Specialization is required"],
        trim: true,
    },
    role: {
        type: String,
        default: "doctor",
    },
    experience: {
        type: Number,
        required: [true, "Years of experience is required"],
        min: [0, "Experience cannot be negative"],
    },
    contactNumber: {
        type: String,
        required: [true, "Contact number is required"],
        match: [/^\d{10}$/, "Contact number must be a 10-digit number"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 8
    },
    appointmentFees: {
        type: Number,
        required: true,
        default: 0
    },
    address: {
        type: {
            line1: String,
            line2: String,
            pincode: String
        },
    },
    licenseNumber: {
        type: String,
        required: [true, "License number is required"],
        unique: [true, "License number must be unique"],
        trim: true,
        default: "NMLS ID 12345"
    },
    qualification: {
        type: String,
        required: [true, "Qualification is required"],
    },
    workingHours: {
        start: {
            type: String, // Example: "09:00"
            required: [true, "Start time is required"],
        },
        end: {
            type: String, // Example: "17:00"
            required: [true, "End time is required"],
        },
    },
    profileImage: {
        type: String,
        default: "data:image/jpeg;base64,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",
    },

}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
