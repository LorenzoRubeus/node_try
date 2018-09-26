const config = require('config');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const { User } = require('../models/users');
const { Basket } = require('../models/baskets');
const { Order } = require('../models/orders');
const { Category } = require('../models/categories');
const { Product } = require('../models/products');

router.get('/:token', async (req, res) => {
    const token = req.params.token;
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));

    const basket = await Basket.findOne({ customer: decoded._id }).populate('products');
    const user = await User.findById(decoded._id);
    const order = await Order.findOne({ customer: decoded._id });

    res.render('myBasket', { user: user, basket: basket, order: order, token: token });
});

router.post('/addBasket/:idProduct/:token', async (req, res) => {
    const token = req.params.token;
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    const idProduct = req.params.idProduct;

    const user = await User.findById(decoded._id);
    let basket = await Basket.findOne({ customer: decoded._id });
    const categories = await Category.find();
    let products = await Product.findById(idProduct);

    basket.count++;
    basket.price += products.price;
    basket.products.push(idProduct);
    basket = await basket.save();   
    basket = await Basket.findOne({ customer: decoded._id }).populate('products.product', { name: 1, seller: 1, price: 1, description: 1 });

    /*const order = await Order.findOne({ customer: decoded._id });
    order.products.push(idProduct);
    order.price += products.price;
    await order.save();*/

    products = await Product.find();

    res.render('products', { user: user, products: products, categories: categories, token: token, basket: basket });
});

module.exports = router;