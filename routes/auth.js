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
    const { error } = validateUserLogin(req.body);
    if(error) { return res.status(400).send(error.details[0].message); } // TODO Da modificare il send con render o qualcosa

    let user = await User.findOne({ email: req.body.txtEmailLogin });
    if(!user) {
        return res.status(400).send("Invalid email or password");
    }

    const validPassword = await bcrypt.compare(req.body.txtPasswordLogin, user.password);
    if(!validPassword){
        return res.status(400).send('Invalid email or password');
    }

    const categories = await Category.find();

    const products = await Product.find();

    const token = user.generateAuthToken();

    const basket = await Basket.findOne({ customer: user._id });

    res.header('x-auth-token', token).render('products', {user: user, basket: basket, categories: categories, products:products, token: token}); // TODO Da modificare il send con render o qualcosa
});

exports.auth = router;