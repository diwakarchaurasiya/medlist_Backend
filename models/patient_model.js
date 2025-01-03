const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    age: {
        type: Number,
        required: [true, "Age is required"],
        min: [0, "Age cannot be negative"],
    },
    role: {
        type: String,
        default: "patient",
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: [true, "Gender is required"],
    },
    dateOfBirth: {
        type: Date,
        required: [true, "Date of Birth is required"],
    },
    contactNumber: {
        type: String,
        required: [true, "Contact number is required"],
        match: [/^\d{10}$/, "Contact number must be a 10-digit number"],
    },
    email: {
        type: String,
        required: [true, "Email  is required"],
        match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
        trim: true,
        unique: [true, "Email is Already Registered"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 8
    },
    address: {
        type: String,
    },
    medicalHistory: {
        type: String,
        default: "No History",
    },
    profileImage: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    },
    emergencyContact: {
        type: String,
        match: [/^\d{10}$/, "Emergency contact must be a 10-digit number"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Patient', patientSchema);
