const { Payment } = require('../models/payments');
const { User } = require('../models/users');
const config = require('config');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

router.get('/managePayment/:token', async (req, res) => {
    const token = req.params.token;
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));

    const payment = await Payment.find({ customer: decoded._id });

    res.render('managePayments', { token:token, payments: payment, count: 0 });
});

router.post('/editPayment/:token', async (req, res) => {
    const token = req.params.token;

    const payment = await Payment.findById(req.body.checkPayment);
    res.render('editPayment', { token: token, payment: payment });
});

router.post('/updatePayment/:token', async (req, res) => {
    const token = req.params.token;
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));

    await Payment.findOneAndUpdate({ customer: decoded._id }, {
        cardHolder: req.body.txtCardHolder,
        cardNumber: req.body.txtCardNumber,
        monthExpired: req.body.txtMonthExpired,
        yearExpired: req.body.txtYearExpired,
    }, { new: true });
    const payments = await Payment.find({ customer: decoded._id }); 

    res.render('managePayments', { token: token, payments: payments, count: 0 });
});

router.post('/deletePayment/:token', async (req, res) => {

});

module.exports = router;