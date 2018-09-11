const express = require('express');
const router = express.Router();
const { User, validateUser } = require('../models/user');
const _ = require('lodash');

router.get('/', (req, res) => {
    res.render('index');
});

router.post('/', (req, res) => {
    res.send('Ao');
});

router.post('/api/registerUser', async (req, res) => {
    const user = new User(
        _.pick(req.body, ['txtFirstName', 'txtLastName', 'txtEmail', 'txtPassword', 'txtConfirmPassword'])
    );
    await user.save();
    res.send('User Registered');
});

router.post('/api/loginUser', (req, res) => {
    console.log(req.body.txtEmailLogin);
});

module.exports = router;