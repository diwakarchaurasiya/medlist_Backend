const jwt = require('jsonwebtoken');
const Doctor = require('../models/doctor_model');
const bcrypt = require('bcrypt');
const upload = require('../middlewares/multer');
const createDoctor = async (req, res) => {
    try {
        // Parse JSON strings back into objects from req.body BEFORE destructuring
        // Ensure you have 'address' field in req.body
        const address = req.body.address ? JSON.parse(req.body.address) : {};
        const workingHours = req.body.workingHours ? JSON.parse(req.body.workingHours) : {};

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
            // 'workingHours' and 'address' are now parsed above, so don't destructure raw from req.body
            // If profileImage is always expected, destructure it too.
            profileImage // Add profileImage here
        } = req.body;

        // --- Data Type Conversions ---
        // Convert numeric fields from strings to numbers, as FormData sends everything as strings
        experience = parseInt(experience, 10);
        appointmentFees = parseFloat(appointmentFees);


        // --- Validation Check ---
        // This check should verify all required fields.
        // For nested objects like address and workingHours, check if the parsed objects are valid
        if (
            !name ||
            !specialization ||
            isNaN(experience) || experience < 0 || // Check if conversion was successful and value is valid
            !contactNumber ||
            !email ||
            !licenseNumber ||
            !qualification ||
            !password ||
            isNaN(appointmentFees) || appointmentFees < 0 || // Check if conversion was successful and value is valid
            !profileImage || // Check if profileImage (Cloudinary URL) is present
            !address || Object.keys(address).length === 0 || // Basic check for address object
            !workingHours || Object.keys(workingHours).length === 0 || // Basic check for workingHours object
            !workingHours.start || !workingHours.end // Check nested properties for workingHours
        ) {
            return res.status(400).json({ success: false, message: 'All required fields are missing or invalid.' });
        }


        // Check if doctor with email already exists
        const docExist = await Doctor.findOne({ email: email });
        if (docExist) {
            return res.status(400).json({ success: false, message: 'Email Already Exist' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Prepare the doctor data object for Mongoose
        const doctorData = {
            name,
            specialization,
            experience,
            contactNumber,
            email,
            appointmentFees,
            password: hashedPassword, // Use the hashed password
            licenseNumber,
            qualification,
            address, // Use the parsed address object
            workingHours, // Use the parsed workingHours object
            profileImage, // Use the Cloudinary URL
            // Add any other fields your Doctor model expects
        };

        const doctor = await Doctor.create(doctorData);
        res.status(201).json({ success: true, data: doctor, message: "Doctor registered successfully!" });

    } catch (error) {
        console.error("Error during doctor registration:", error); // Log the actual error for debugging
        res.status(500).json({ success: false, message: "Error during doctor registration: " + error.message });
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
        const doctorToken = await jwt.sign({ role: doctor.role, email: doctor.email }, process.env.JWT_SECRET);
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
