const express = require('express');
const router = express.Router();
const { User } = require('../models/users');
const config = require('config');
const auth = require('../middleware/auth');

router.get('/', auth, (req, res) => {
    res.render('profile');
});

module.exports = router;