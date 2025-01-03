const express = require('express');
const router = express.Router();
const { createDoctor, getAllDoctors, getDoctorById, updateDoctor, deleteDoctor, loginDoctor } = require('../controllers/doctors_controller');
const authMiddleware = require('../middlewares/doctors/authD');
const upload = require('../middlewares/multer');

router.post('/register', upload.single('profileImage'), createDoctor);
router.post('/login', loginDoctor);
// router.post('/login', loginDoctor);email, password
router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);
router.put('/:id', updateDoctor);
router.delete('/:id', authMiddleware, deleteDoctor);

module.exports = router;