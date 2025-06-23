const express = require('express');
const router = express.Router();

const {
    createPayment,
    refundPayment,
    getTodaysPayments,
    getAllPayments,
    updateAppointmentPaymentStatus,
} = require('../controllers/payment_controller');
const authenticateUser = require('../middlewares/authMiddleware');

// Use directly without dot notation
router.post('/', authenticateUser, createPayment);
router.put('/refund/:paymentId', authenticateUser, refundPayment);
router.put('/payment-status/:id', authenticateUser, updateAppointmentPaymentStatus);
router.get('/today', authenticateUser, getTodaysPayments);
router.get('/', authenticateUser, getAllPayments);

module.exports = router;
