const express = require('express');
const home = require('../routes/home');

module.exports = function(app) {
    app.set('view engine', 'pug');
    app.use(express.json());
    app.use('/', home);
}