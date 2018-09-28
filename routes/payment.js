const { Payment } = require('../models/payments');
const { User } = require('../models/users');
const { Order } = require('../models/orders'); 
const { Basket } = require('../models/baskets'); 
const { Address } = require('../models/addresses');
const config = require('config');
const moment = require('moment');
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

router.post('/updatePayment/:token/:idPayment', async (req, res) => {
    const token = req.params.token;
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    const idPayment = req.params.idPayment;

    await Payment.findByIdAndUpdate(idPayment, {
        cardHolder: req.body.txtCardHolder,
        cardNumber: req.body.txtCardNumber,
        monthExpired: req.body.txtMonthExpired,
        yearExpired: req.body.txtYearExpired,
    }, { new: true });
    const payments = await Payment.find({ customer: decoded._id }); 

    res.render('managePayments', { token: token, payments: payments, count: 0 });
});

router.post('/deletePayment/:token/:idPayment', async (req, res) => {
    const token = req.params.token;
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    const idPayment = req.params.idPayment;

    await Payment.findByIdAndRemove(idPayment);
    const payments = await Payment.find({ customer: decoded._id });

    res.render('managePayments', { token: token, payments: payments, count: 0 });
});

router.post('/confirmPayment/:token', async (req, res) => {
    const token = req.params.token;
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));

    const basket = await Basket.findOne({ customer: decoded._id }).populate('products');
    const user = await User.findById(decoded._id);
    await Order.findOneAndUpdate({ customer: decoded._id }, {
        price: basket.price,
        dateOrder: new Date(),
        dateEstimated: moment(new Date(), "DD-MM-YYYY").add(4, 'days'),
        products: basket.products
    });

    res.render('myBasket', { token: token, user: user, basket: basket, count: 0 })
});

router.post('/pay/:token', async (req, res) => {
    const token = req.params.token;
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));

    const basket = await Basket.findOne({ customer: decoded._id }).populate('products');
    const addresses = await Address.find({ customer: decoded._id });
    const payments = await Payment.find({ customer: decoded._id });


    res.render('pay', {token: token, basket: basket, addresses: addresses, payments: payments});
})

module.exports = router;