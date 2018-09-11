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
    /*const user = new User(
        _.pick(req.body, ['txtFirstName', 'txtLastName', 'txtEmail', 'txtPassword', 'txtConfirmPassword'])
    );*/

    const user = new User({
        firstName: req.body.txtFirstName,
        lastName: req.body.txtLastName,
        email: req.body.txtEmail, 
        password: req.body.txtPassword      
    }); //TODO Sostituire req.body con .pick() di lodash

    await user.save();
    res.send('User Registered');
});

router.post('/api/loginUser', async (req, res) => {
    const user = await User.findOne({ email: req.body.txtEmail, password: req.body.txtEmail });
    if(!user) {
        res.send("The email or/and the password is/are wrong");
    }
    res.send('User Logged');
});

module.exports = router;