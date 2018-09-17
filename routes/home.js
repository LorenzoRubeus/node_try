const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
    res.render('index');
});

router.post('/', (req, res) => {
    res.send('Ao');
});

module.exports = router;