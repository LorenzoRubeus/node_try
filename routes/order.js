const mongoose = require('mongoose');
const config = require('config');
const { Order } = require('../models/orders');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.get('/', auth, async (req, res) => {
    const orders = await Order.find({ customer: req.user._id }).populate('products');
    //res.send(orders[1].products);
    res.render('viewOrders', { orders: orders });
});

module.exports = router;