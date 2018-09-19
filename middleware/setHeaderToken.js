const { token } = require('../routes/auth');

module.exports = function (req, res, next) {
    res.send(token);
}