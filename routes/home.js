const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const Cookies = require('cookies');
const { User } = require('../models/users');
const { Category } = require('../models/categories');
const { Product } = require('../models/products');
const { Basket } = require('../models/baskets');
const jwt = require('jsonwebtoken');
const config = require('config');
const btoa = require('btoa');

router.get('/', async (req, res) => {
    let cookies = new Cookies(req, res);
    if(cookies.get('Token', { signed: false })) {
        const obj = await getModels(cookies);
        res.render('products', { user: obj.user, basket: obj.basket, categories: obj.categories, products: obj.products, pictures: obj.pictures });
    }
    res.render('index');
});

router.post('/', (req, res) => {
    res.send('Ao');
});


async function getModels(cookie) {
    const token = cookie.get('Token', { signed: false });
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    const user = await User.findById(decoded._id);
    const categories = await Category.find();
    const products = await Product.find();
    const basket = await Basket.findOne({ customer: user._id });
    let pictures = [];
    for (let i = 0; i < products.length; i++) {
        pictures.push(btoa(products[i].img.data));
    }
    let obj = {
        user: user,
        basket: basket,
        categories: categories,
        products: products,
        pictures: pictures
    };
    return obj;
}


module.exports = router;