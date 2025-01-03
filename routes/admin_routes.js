const express = require('express');
const adminRouter = express.Router();
const { getAllDoctors, getAllPatients, deleteDoctor, deletePatient, updateDoctorApprovalStatus } = require('../controllers/admin_controller');
const upload = require('../middlewares/multer');

adminRouter.post('/doctors/:id/approve', updateDoctorApprovalStatus);
adminRouter.get('/doctors', getAllDoctors);
adminRouter.get('/patients', getAllPatients);
adminRouter.delete('/doctors/:id', deleteDoctor);
adminRouter.delete('/patients/:id', deletePatient);


export default adminRouter;
