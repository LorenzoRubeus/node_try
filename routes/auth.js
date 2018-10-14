const express = require('express');
const router = express.Router();
const { User, validateUser, validateUserLogin } = require('../models/users');
const { Category } = require('../models/categories');
const { Product } = require('../models/products');
const { Basket } = require('../models/baskets');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const config = require('config');
const btoa = require('btoa');
const auth = require('../middleware/auth');
const Cookies = require('cookies');

router.post('/', async (req, res) => {
    let err = "";
    var cookies = new Cookies(req, res);

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
    let pictures = [];

    for(let i = 0; i < products.length; i++) {
        pictures.push(btoa(products[i].img.data));
    }

    let token = user.generateAuthToken();
    cookies.set('Token', token, { signed: false, maxAge: 14*24*60*60000 });  //Expires in 14 days calculated in ms
    
    res.render('products', {err: err, user: user, basket: basket, categories: categories, products:products, pictures: pictures }); // TODO Da modificare il send con render o qualcosa
});

module.exports = router;