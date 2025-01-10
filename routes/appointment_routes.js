const express = require('express');
const router = express.Router();
const { createAppointment, getAllAppointments, updateAppointmentStatus, deleteAppointment } = require('../controllers/appoinment_controller');
const doctorAuth = require('../middlewares/doctors/authDoctor');
const patientAuth = require('../middlewares/patients/authPatient');

router.post('/create', createAppointment);
// router.post('/login', loginDoctor);email, password
router.get('/', getAllAppointments);
router.patch('/:id', updateAppointmentStatus);
router.delete('/:id', deleteAppointment);

module.exports = router;