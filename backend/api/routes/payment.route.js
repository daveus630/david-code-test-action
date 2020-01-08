const express = require('express');
const paymentController = require('../controllers/payment.controller');

const router = express.Router();

router.get('/payment', paymentController.getPayment);

router.post('/payment', paymentController.postPayment);

module.exports = router;