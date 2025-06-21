const express = require('express');
const adminRouter = express.Router();
const { getAllDoctors, getAllPatients, deleteDoctor, deletePatient, updateDoctorApprovalStatus, loginAdmin, registerAdmin } = require('../controllers/admin_controller');
const upload = require('../middlewares/multer');

// Admin routes for managing doctors and patients
//adminlogin
adminRouter.post('/login', loginAdmin);
adminRouter.post('/register', registerAdmin);
// Approve or reject a doctor's registration

adminRouter.post('/doctors/:id/approve', updateDoctorApprovalStatus);
adminRouter.get('/doctors', getAllDoctors);
adminRouter.get('/patients', getAllPatients);
adminRouter.delete('/doctors/:id', deleteDoctor);
adminRouter.delete('/patients/:id', deletePatient);


module.exports = adminRouter;
