const express = require('express');
const router = express.Router();
const { createDoctor, getAllDoctors, getDoctorById, updateDoctor, deleteDoctor, loginDoctor, uploadProfileImage } = require('../controllers/doctors_controller');
const authMiddleware = require('../middlewares/doctors/authDoctor');
const patientAuth = require('../middlewares/patients/authPatient');
const multer = require('multer');
const upload = multer();

router.post('/register', upload.none(), createDoctor);
router.post('/login', loginDoctor);
router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);
router.put('/:id', updateDoctor);
router.put('/image/:id', upload.single('profileImage'), uploadProfileImage);
router.delete('/:id', deleteDoctor);

module.exports = router;