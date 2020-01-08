const Payment = require('../models/payment.model');

exports.getPayment = (req, res, next) => {
    const payments = Payment.getAllPayments(); 
    res.send(payments);
}

exports.postPayment = (req, res, next) => { 
    const payment = new Payment(req.body);
    payment.save();
    res.send({message: 'Data input saved successfully!'});
}