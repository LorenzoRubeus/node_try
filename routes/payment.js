const { Payment, validatePayment } = require('../models/payments');
const { User } = require('../models/users');
const { Order } = require('../models/orders'); 
const { Basket } = require('../models/baskets'); 
const { Address } = require('../models/addresses');
const { Product } = require('../models/products');
const { Category } = require('../models/categories');
const config = require('config');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

router.get('/managePayment/:token', async (req, res) => {
    const token = req.params.token;
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));

    const payments = await Payment.find({ customer: decoded._id });

    res.render('managePayments', { token: token, payments: payments, count: 0 });
});

router.get('/addPayment/:token', async (req, res) => {
    const token = req.params.token;
    
    res.render('profileAddPayment', { token: token });
});

router.get('/editPayment/:token/:id', async (req, res) => {
    const token = req.params.token;
    const idPayment = req.params.id;

    const payment = await Payment.findById(idPayment);
    res.render('editPayment', { token: token, payment: payment });
});

router.post('/addPayment/:token', async (req, res) => {
    const token = req.params.token;
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));

    const { error } = validatePayment(req.body);
    if(error) {
        let err = error.details[0].context.label;
        return res.render('profileAddPayment', { token: token, err: err });
    }

    let payment = new Payment({
        customer: decoded._id,
        cardHolder: req.body.txtCardHolder,
        cardCircuit: req.body.selCardCircuit,
        cardNumber: req.body.txtCardNumber,
        monthExpired: req.body.txtMonthExpired,
        yearExpired: req.body.txtYearExpired
    });
    await payment.save();

    const payments = await Payment.find({ customer: decoded._id });
    res.render('managePayments', { token: token, payments: payments });
});

router.post('/updatePayment/:token/:idPayment', async (req, res) => {
    const token = req.params.token;
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    const idPayment = req.params.idPayment;
    let err = "";

    if(!await Payment.findById(idPayment)) {
        let payment = await Payment.find({ customer: decoded._id });
        err = "Payment not found";
        return res.render('editPayment', { err: err, token: token, payment: payment });
    }

    const { error } = validatePayment(req.body);
    if(error) {
        let payment = await Payment.findById(idPayment);
        err = error.details[0].context.label;
        return res.render('editPayment', { err: err, token: token, payment: payment });
    }

    await Payment.findByIdAndUpdate(idPayment, {
        cardHolder: req.body.txtCardHolder,
        cardNumber: req.body.txtCardNumber,
        cardCircuit: req.body.selCardCircuit,
        monthExpired: req.body.txtMonthExpired,
        yearExpired: req.body.txtYearExpired,
    }, { new: true });
    const payments = await Payment.find({ customer: decoded._id }); 

    res.render('managePayments', { token: token, payments: payments });
});

router.post('/deletePayment/:token/:idPayment', async (req, res) => {
    const token = req.params.token;
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    const idPayment = req.params.idPayment;

    if(!await Payment.findByIdAndRemove(idPayment)) {
        let err = "Payment not found";
        let pays = await Payment.find({ customer: decoded._id });
        return res.render('managePayments', { token: token, err: err, payments: pays });
    }
    //await Payment.findByIdAndRemove(idPayment);
    const payments = await Payment.find({ customer: decoded._id });

    res.render('managePayments', { token: token, payments: payments });
});

router.post('/confirmPayment/:token', async (req, res) => {
    const token = req.params.token;
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));

    const products = await Product.find();
    const categories = await Category.find();

    let basket = await Basket.findOne({ customer: decoded._id }).populate('products');
    const user = await User.findById(decoded._id);

    let order = new Order({
        customer: decoded._id,
        address: req.body.rdbAddress,
        payment: req.body.rdbPayment,
        price: basket.price,
        dateOrder: new Date(),
        dateEstimated: moment(new Date(), "DD-MM-YYYY").add(4, 'days'),
        products: basket.products
    });
    await order.save();

    basket.price = 0;
    basket.products = [];
    basket.count = 0;
    await basket.save();

    res.render('products', { token: token, user: user, categories: categories, products: products, basket: basket, count: 0 })
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