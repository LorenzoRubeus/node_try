const { Payment, validatePayment } = require('../models/payments');
const { User } = require('../models/users');
const { Order } = require('../models/orders'); 
const { Basket } = require('../models/baskets'); 
const { Address } = require('../models/addresses');
const { Product } = require('../models/products');
const { Category } = require('../models/categories');
const auth = require('../middleware/auth');
const config = require('config');
const moment = require('moment');
const express = require('express');
const router = express.Router();


router.get('/managePayment', auth, async (req, res) => {
    if(req.session.localVar) {
        let localVar = req.session.localVar;
        req.session.destroy();
        return res.render('managePayments', { payments: localVar.payments, count: 0 });
    }

    const payments = await Payment.find({ customer: req.user._id });
    res.render('managePayments', { payments: payments, count: 0 });
});

router.get('/addPayment', auth, async (req, res) => {
    res.render('profileAddPayment');
});

router.get('/editPayment/:id', auth, async (req, res) => {
    const idPayment = req.params.id;

    const payment = await Payment.findById(idPayment);
    res.render('editPayment', {payment: payment });
});


router.post('/addPayment', auth, async (req, res) => {
    const { error } = validatePayment(req.body);
    if(error) {
        let err = error.details[0].context.label;
        return res.render('profileAddPayment', { err: err });
    }

    let payment = new Payment({
        customer: req.user._id,
        cardHolder: req.body.txtCardHolder,
        cardCircuit: req.body.selCardCircuit,
        cardNumber: req.body.txtCardNumber,
        monthExpired: req.body.txtMonthExpired,
        yearExpired: req.body.txtYearExpired
    });
    await payment.save();

    const payments = await Payment.find({ customer: req.user._id });
    res.render('managePayments', { payments: payments });
});

router.post('/updatePayment/:idPayment', auth, async (req, res) => {
    const idPayment = req.params.idPayment;
    let err = "";

    if(!await Payment.findById(idPayment)) {
        let payment = await Payment.find({ customer: req.user._id });
        err = "Payment not found";
        return res.render('editPayment', { err: err, payment: payment });
    }

    const { error } = validatePayment(req.body);
    if(error) {
        let payment = await Payment.findById(idPayment);
        err = error.details[0].context.label;
        return res.render('editPayment', { err: err, payment: payment });
    }

    await Payment.findByIdAndUpdate(idPayment, {
        cardHolder: req.body.txtCardHolder,
        cardNumber: req.body.txtCardNumber,
        cardCircuit: req.body.selCardCircuit,
        monthExpired: req.body.txtMonthExpired,
        yearExpired: req.body.txtYearExpired,
    }, { new: true });
    const payments = await Payment.find({ customer: req.user._id }); 
    req.session.localVar = {
        payments: payments
    }

    res.redirect('/api/payments/managePayment');
});

router.post('/deletePayment/:idPayment', auth, async (req, res) => {
    const idPayment = req.params.idPayment;

    if(!await Payment.findByIdAndRemove(idPayment)) {
        let err = "Payment not found";
        let pays = await Payment.find({ customer: req.user._id });
        return res.render('managePayments', { err: err, payments: pays });
    }
    const payments = await Payment.find({ customer: req.user._id });
    req.session.localVar = {
        payments: payments
    }
    
    res.redirect('/api/payments/managePayment');
});

router.post('/confirmPayment', auth, async (req, res) => {
    const products = await Product.find();
    const categories = await Category.find();

    let basket = await Basket.findOne({ customer: req.user._id }).populate('products');
    const user = await User.findById(req.user._id);

    let order = new Order({
        customer: req.user._id,
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

    res.render('products', { user: user, categories: categories, products: products, basket: basket, count: 0 })
});

router.post('/pay', auth, async (req, res) => {
    const basket = await Basket.findOne({ customer: req.user._id }).populate('products');
    const addresses = await Address.find({ customer: req.user._id });
    const payments = await Payment.find({ customer: req.user._id });

    res.render('pay', { basket: basket, addresses: addresses, payments: payments });
})

module.exports = router;