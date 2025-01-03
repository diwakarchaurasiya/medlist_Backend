const Patient = require('../models/patient_model');
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;
const jwt = require('jsonwebtoken');





// Create a new patient
const createPatient = async (req, res) => {
    try {
        console.log(req.body);
        const { name, age, gender, dateOfBirth, contactNumber, email, password } = req.body;
        if (!name || !age || !gender || !dateOfBirth || !contactNumber || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        let userExist = await Patient.findOne({ email: email });
        if (userExist) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Upload profile image to Cloudinary
        // const localImage = req.file;
        // const uploadCloudinary = await cloudinary.uploader.upload(localImage?.path, { resource_type: "image" });
        // const imageUrl = uploadCloudinary.secure_url;
        const imageUrl = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

        // Create a new patient
        const patientData = {
            ...req.body,
            password: hashedPassword,
            profileImage: imageUrl
        };
        const patient = await Patient.create(patientData);
        res.status(201).json({ success: true, data: patient });
    } catch (error) {
        res.status(400).json({ success: false, message: "Error occured " + error.message });
    }
};

//login loginPatient

const loginPatient = async (req, res) => {
    try {
        let { email, password } = req.body;
        email = email.toLowerCase();
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        const patient = await Patient.findOne({ email: email });
        if (!patient) {
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }
        const validPassword = await bcrypt.compare(password, patient.password);
        if (!validPassword) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }
        const patientToken = await jwt.sign({ role: patient.role, id: patient._id }, process.env.JWT_SECRET);
        res.cookie("authToken", patientToken);

        res.status(200).json({ success: true, data: "Login Sucessfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


// Get all patients
const getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.find();
        res.status(200).json({ success: true, data: patients });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get patient by ID
const getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }
        res.status(200).json({ success: true, data: patient });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a patient
const updatePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!patient) {
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }
        res.status(200).json({ success: true, data: patient });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a patient
const deletePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);
        if (!patient) {
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }
        res.status(200).json({ success: true, message: 'Patient deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Export all functions individually
module.exports = {
    createPatient,
    getAllPatients,
    getPatientById,
    updatePatient,
    deletePatient,
    loginPatient
};
