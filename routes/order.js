const mongoose = require('mongoose');
const config = require('config');
const { Order } = require('../models/orders');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const btoa = require('btoa');

router.get('/', auth, async (req, res) => {
    const orders = await Order.find({ customer: req.user._id }).populate('products');
    let pictures = [];
    for(let i = 0; i < orders.length; i++) {
        pictures.push(getPictures(orders[i].products));
    }
    res.render('viewOrders', { orders: orders, pictures: pictures });
});


function getPictures(products) {
    let pictures = [];
    for(let i = 0; i < products.length; i++) {
        pictures.push(btoa(products[i].img.data));
    }
    return pictures;
}


module.exports = router;