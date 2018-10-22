const mongoose = require('mongoose');
const config = require('config');
const { Order } = require('../models/orders');
const { Basket } = require('../models/baskets');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const btoa = require('btoa');

router.get('/', auth, async (req, res) => {
    const orders = await Order.find({ customer: req.user._id }).populate('products address');
    const basket = await Basket.findOne({ customer: req.user._id});
    let dateEstimated = [];
    let dateOrder = [];
    let pictures = [];
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    for( let i = 0; i < orders.length; i++ ) {
        dateOrder.push(getData(orders[i].dateOrder));
    }
    for( let i = 0; i < orders.length; i++ ) {
        dateEstimated.push(getData(orders[i].dateEstimated));
    }
    for( let i = 0; i < orders.length; i++ ) {
        pictures.push(getPictures(orders[i].products));
    } 

    if( req.session.localVar ) {
        let localVar = req.session.localVar;
        req.session.destroy();
        return res.render('viewOrders', { basket: basket, orders: localVar.orders, pictures: localVar.pictures, filteredMonth: localVar.filteredMonth, months: localVar.months, dateOrder: localVar.dateOrder, dateEstimated: localVar.dateEstimated });
    }
    res.render('viewOrders', { orders: orders, basket: basket, pictures: pictures, months: months, dateOrder: dateOrder, dateEstimated: dateEstimated });
});

router.get('/filterByMonth/:month', auth, async (req, res) => {
    const monthFilter = req.params.month;
    const orders = await Order.find({ customer: req.user._id }).populate('products address');
    let ordersFiltered = [];
    let pictures = [];
    let dateEstimated = [];
    let dateOrder = [];
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    for( let i = 0; i < orders.length; i++ ) {
        let monthOrder = orders[i].dateOrder.getUTCMonth();
        if( monthOrder == monthFilter) {
            ordersFiltered.push(orders[i]);
        }
    }
    for( let i = 0; i < ordersFiltered.length; i++ ) {
        dateOrder.push(getData(ordersFiltered[i].dateOrder));
    }
    for( let i = 0; i < ordersFiltered.length; i++ ) {
        dateEstimated.push(getData(ordersFiltered[i].dateEstimated));
    }
    for( let i = 0; i < ordersFiltered.length; i++ ) {
        pictures.push(getPictures(ordersFiltered[i].products));
    } 

    req.session.localVar = {
        orders: ordersFiltered,
        pictures: pictures,
        months: months,
        dateOrder: dateOrder,
        dateEstimated: dateEstimated,
        filteredMonth: months[monthFilter]
    }

    res.redirect('/api/orders');
});



function getPictures(products) {
    let pictures = [];
    for(let i = 0; i < products.length; i++) {
        pictures.push(btoa(products[i].img.data));
    }
    return pictures;
}

function getData(dateOrder) {
    let date = dateOrder;
    let month = date.getUTCMonth() + 1; //months from 1-12
    let day = date.getUTCDate();
    let year = date.getUTCFullYear();

    let objDate = {
        month: month,
        day: day,
        year: year
    }

    return objDate;
}

module.exports = router;