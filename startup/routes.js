const express = require('express');
const passport = require('passport');
const home = require('../routes/home');
const auth = require('../routes/auth');
const product = require('../routes/product');
const register = require('../routes/register');
const category = require('../routes/category');
const address = require('../routes/address');
const profile = require('../routes/profile');
const basket = require('../routes/basket');
const payment = require('../routes/payment');
const order = require('../routes/order');
const picture = require('../routes/picture');
const Cookies = require('cookies');

const bodyParser = require('body-parser');

module.exports = function(app) {
    /*app.use(function(req, res, next) {
        let cookies = new Cookies(req, res);
        if(cookies.get('Token', { signed: false })) {
            res.render()
        }
        next();
    });*/
    app.set('view engine', 'pug');
    app.use(express.static('public'));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(passport.initialize());
    app.use('/', home);
    app.use('/api/registerUser', register);
    app.use('/api/loginUser', auth);
    app.use('/api/products', product);
    app.use('/api/categories', category);
    app.use('/api/address', address);
    app.use('/api/myProfile', profile);
    app.use('/api/payments', payment);
    app.use('/api/basket', basket);
    app.use('/api/orders', order);


    app.use('/api/pictures', picture);
}