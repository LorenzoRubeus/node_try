const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');
const { Order } = require('../models/orders');

const express = require('express');
const router = express.Router();

router.get('/:token', async (req, res) => {
    const token = req.params.token;
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));

    const orders = await Order.find({ customer: decoded._id });
    res.render('viewOrders', { orders: orders, token: token });
});

module.exports = router;