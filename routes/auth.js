const express = require('express');
const router = express.Router();
const { User, validateUser, validateUserLogin } = require('../models/users');
const { Category } = require('../models/categories');
const { Product } = require('../models/products');
const { Basket } = require('../models/baskets');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const config = require('config');

router.post('/', async (req, res) => {
    let err = "";

    const { error } = validateUserLogin(req.body);
    if(error) { 
        let err = error.details[0].context.label;
        return res.render('index', { err: err, redirect: "login" });
    } 

    let user = await User.findOne({ email: req.body.txtEmailLogin });
    if(!user) {
        err = "Invalid Credential";
        return res.render('index', { err: err, redirect: "login" });
    }

    const validPassword = await bcrypt.compare(req.body.txtPasswordLogin, user.password);
    if(!validPassword){
        err = "Invalid Credential";
        return res.render('index', { err: err, redirect: "login" });
    }

    const categories = await Category.find();
    const products = await Product.find();
    const basket = await Basket.findOne({ customer: user._id });

    const token = user.generateAuthToken();

    res.header('x-auth-token', token).render('products', {err: err, user: user, basket: basket, categories: categories, products:products, token: token}); // TODO Da modificare il send con render o qualcosa
});

exports.auth = router;