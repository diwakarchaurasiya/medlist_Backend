const Doctor = require('../models/Doctor'); // Path to the Doctor schema/model
const Patient = require('../models/Patient'); // Path to the Patient schema/model

const adminController = {
    // Get all doctors
    getAllDoctors: async (req, res) => {
        try {
            const doctors = await Doctor.find();
            res.status(200).json({ message: "Doctors retrieved successfully", data: doctors });
        } catch (error) {
            res.status(500).json({ message: "Error fetching doctors", error: error.message });
        }
    },

    // Get all patients
    getAllPatients: async (req, res) => {
        try {
            const patients = await Patient.find();
            res.status(200).json({ message: "Patients retrieved successfully", data: patients });
        } catch (error) {
            res.status(500).json({ message: "Error fetching patients", error: error.message });
        }
    },

    // Delete a doctor by ID
    deleteDoctor: async (req, res) => {
        try {
            const doctor = await Doctor.findByIdAndDelete(req.params.id);
            if (!doctor) {
                return res.status(404).json({ message: "Doctor not found" });
            }
            res.status(200).json({ message: "Doctor deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error deleting doctor", error: error.message });
        }
    },

    // Delete a patient by ID
    deletePatient: async (req, res) => {
        try {
            const patient = await Patient.findByIdAndDelete(req.params.id);
            if (!patient) {
                return res.status(404).json({ message: "Patient not found" });
            }
            res.status(200).json({ message: "Patient deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error deleting patient", error: error.message });
        }
    },

    // Update a doctor's approval status (e.g., activate/deactivate a doctor account)
    updateDoctorApprovalStatus: async (req, res) => {
        try {
            const { isApproved } = req.body; // Example field for approval
            const doctor = await Doctor.findByIdAndUpdate(req.params.id, { isApproved }, { new: true, runValidators: true });
            if (!doctor) {
                return res.status(404).json({ message: "Doctor not found" });
            }
            res.status(200).json({ message: "Doctor approval status updated successfully", data: doctor });
        } catch (error) {
            res.status(400).json({ message: "Error updating approval status", error: error.message });
        }
    },
};

module.exports = adminController;
