const express = require('express');
const router = express.Router();
const { createAppointment, getAllAppointments, updateAppointmentStatus, deleteAppointment, getAppointmentsByDoctorId, getAppointmentsByPatientId } = require('../controllers/appoinment_controller');
const doctorAuth = require('../middlewares/doctors/authDoctor');
const patientAuth = require('../middlewares/patients/authPatient');

router.post('/create', createAppointment);
// router.post('/login', loginDoctor);email, password
router.get('/', getAllAppointments);
router.patch('/:id', updateAppointmentStatus);
router.delete('/:id', deleteAppointment);
// Get appointments by patient ID
router.get('/patient/:patientId', getAppointmentsByPatientId);

// Get appointments by doctor ID
router.get('/doctor/:doctorId', getAppointmentsByDoctorId);

module.exports = router;