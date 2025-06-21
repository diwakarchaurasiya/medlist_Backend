const express = require('express');
const {
    createPatient,
    getAllPatients,
    getPatientById,
    updatePatient,
    deletePatient,
    loginPatient,
} = require('../controllers/patient_controller');
const router = express.Router();

// Create a new patient
router.post('/register', createPatient);

router.post('/login', loginPatient);
// Get all patients
router.get('/', getAllPatients);

// Get a specific patient by ID
router.get('/:id', getPatientById);

// Update a specific patient by ID
router.put('/:id', updatePatient);

// Delete a specific patient by ID
router.delete('/:id', deletePatient);

module.exports = router;
