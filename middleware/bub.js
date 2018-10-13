const jwt = require('jsonwebtoken');
const config = require('config');
const { token } = require('../routes/auth');

module.exports = function (req, res, next) {
    res.send(token);
    next();
}