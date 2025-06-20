const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    docId: {
        type: String,
        required: [true, "Doctor ID is required"],
        unique: true,
        trim: true,
    },
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
        default: "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg",
    },

}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
