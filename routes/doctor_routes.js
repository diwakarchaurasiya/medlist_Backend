const express = require('express');
const router = express.Router();
const { createDoctor, getAllDoctors, getDoctorById, updateDoctor, deleteDoctor, loginDoctor } = require('../controllers/doctors_controller');
const multer = require('multer');
const authenticateUser = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/authorizeRole');
const upload = multer();

router.post('/register', upload.none(), createDoctor);
router.post('/login', loginDoctor);
router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);
router.put('/:id', authenticateUser, authorizeRoles("admin"), updateDoctor);
router.delete('/:id', authenticateUser, authorizeRoles("admin"), deleteDoctor);

module.exports = router;