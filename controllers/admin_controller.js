const Admin = require("../models/admin_model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const doctor_model = require("../models/doctor_model");
const patient_model = require("../models/patient_model");

const adminController = {
    // 🛡️ Admin Login
    loginAdmin: async (req, res) => {
        try {
            let { email, password } = req.body;
            email = email.toLowerCase();

            if (!email || !password) {
                return res.status(400).json({ success: false, message: 'All fields are required' });
            }

            const admin = await Admin.findOne({ email });
            if (!admin) {
                return res.status(404).json({ success: false, message: 'Admin not found' });
            }

            const validPassword = await bcrypt.compare(password, admin.password);
            if (!validPassword) {
                return res.status(400).json({ success: false, message: 'Invalid credentials' });
            }

            const adminToken = jwt.sign(
                { id: admin._id, role: "admin", email: admin.email },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            res.status(200).json({
                success: true,
                data: {
                    user: {
                        id: admin._id,
                        name: admin.name,
                        email: admin.email,
                        role: "admin"
                    },
                    token: adminToken
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },


    // ✅ Optional: Register Admin (one-time setup)
    registerAdmin: async (req, res) => {
        try {
            const { name, email, password } = req.body;

            const existing = await Admin.findOne({ email: email.toLowerCase() });
            if (existing) {
                return res.status(400).json({ message: "Admin already exists" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const admin = await Admin.create({
                name,
                email: email.toLowerCase(),
                password: hashedPassword,
            });

            res.status(201).json({ message: "Admin registered", admin });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // 📋 Get all doctors
    getAllDoctors: async (req, res) => {
        try {
            const doctors = await doctor_model.find();
            res
                .status(200)
                .json({ message: "Doctors retrieved successfully", data: doctors });
        } catch (error) {
            res
                .status(500)
                .json({ message: "Error fetching doctors", error: error.message });
        }
    },

    // 📋 Get all patients
    getAllPatients: async (req, res) => {
        try {
            const patients = await patient_model.find();
            res
                .status(200)
                .json({ message: "Patients retrieved successfully", data: patients });
        } catch (error) {
            res
                .status(500)
                .json({ message: "Error fetching patients", error: error.message });
        }
    },

    // ❌ Delete a doctor by ID
    deleteDoctor: async (req, res) => {
        try {
            const doctor = await doctor_model.findByIdAndDelete(req.params.id);
            if (!doctor) {
                return res.status(404).json({ message: "Doctor not found" });
            }
            res.status(200).json({ message: "Doctor deleted successfully" });
        } catch (error) {
            res
                .status(500)
                .json({ message: "Error deleting doctor", error: error.message });
        }
    },

    // ❌ Delete a patient by ID
    deletePatient: async (req, res) => {
        try {
            const patient = await patient_model.findByIdAndDelete(req.params.id);
            if (!patient) {
                return res.status(404).json({ message: "Patient not found" });
            }
            res.status(200).json({ message: "Patient deleted successfully" });
        } catch (error) {
            res
                .status(500)
                .json({ message: "Error deleting patient", error: error.message });
        }
    },

    // ✅ Update doctor's approval status
    updateDoctorApprovalStatus: async (req, res) => {
        try {
            const { isApproved } = req.body;
            const doctor = await doctor_model.findByIdAndUpdate(
                req.params.id,
                { isApproved },
                { new: true, runValidators: true }
            );

            if (!doctor) {
                return res.status(404).json({ message: "Doctor not found" });
            }

            res.status(200).json({
                message: "Doctor approval status updated successfully",
                data: doctor,
            });
        } catch (error) {
            res.status(400).json({
                message: "Error updating approval status",
                error: error.message,
            });
        }
    },
};

module.exports = adminController;
