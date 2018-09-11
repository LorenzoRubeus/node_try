const express = require('express');
const home = require('../routes/home');
const bodyParser = require('body-parser');

module.exports = function(app) {
    app.set('view engine', 'pug');
    app.use(express.static('public'));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.json());
    app.use('/', home);
}