const jwt = require('jsonwebtoken');
const Doctor = require('../models/doctor_model');
const bcrypt = require('bcrypt');
const upload = require('../middlewares/multer');
// Create a new doctor
const createDoctor = async (req, res) => {
    try {
        let {
            name,
            specialization,
            experience,
            contactNumber,
            email,
            appointmentFees,
            password,
            licenseNumber,
            qualification,
            workingHours
        } = req.body;
        console.log(req.file);
        // Check if all fields are entered
        if (!name || !specialization || !experience || !contactNumber || !email || !licenseNumber || !qualification || !workingHours || !password || !appointmentFees) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        const docExist = await Doctor.findOne({ email: email });
        if (docExist) {
            return res.status(400).json({ success: false, message: 'Email Already Exist' });
        }
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new doctor

        const doctorData = { ...req.body, password: hashedPassword }

        const doctor = await Doctor.create(doctorData);
        res.status(201).json({ success: true, data: doctor });
    } catch (error) {
        res.status(400).json({ success: false, message: "Error during doctor registration " + error.message });
    }
};




const cloudinary = require('../config/cloudinary'); // Import cloudinary
// Update profile image
const uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'doctor_profiles',
        });

        let profileUpdated = await Doctor.findByIdAndUpdate(req.params.id, { profileImage: result.secure_url }, { new: true });
        if (!profileUpdated) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.status(200).json({ success: true, message: "Profile Photo Updated successfully" });
    } catch (error) {
        console.error('Upload Error:', error.message); // Debug log for error
        res.status(500).json({ message: 'Failed to upload image', error: error.message });
    }
};






const loginDoctor = async (req, res) => {
    try {
        let { email, password } = req.body;
        email = email.toLowerCase();
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        const doctor = await Doctor.findOne({ email: email });
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }
        const validPassword = await bcrypt.compare(password, doctor.password);
        if (!validPassword) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }
        const doctorToken = await jwt.sign({ role: doctor.role, id: doctor._id }, process.env.JWT_SECRET);
        res.cookie("authToken", doctorToken);

        res.status(200).json({ success: true, data: doctorToken });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
// Get all doctors
const getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.status(200).json({ success: true, data: doctors });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get doctor by ID
const getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }
        res.status(200).json({ success: true, data: doctor });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a doctor
const updateDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }
        res.status(200).json({ success: true, data: doctor });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a doctor
const deleteDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndDelete(req.params.id);
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }
        res.status(200).json({ success: true, message: 'Doctor deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Export all functions individually
module.exports = {
    createDoctor,
    getAllDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor,
    loginDoctor,
    uploadProfileImage
};
