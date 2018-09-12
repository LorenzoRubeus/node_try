const express = require('express');
const router = express.Router();
const { User, validateUser } = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');

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
    const hash = await bcrypt.genSalt(10);

    const user = new User({
        firstName: req.body.txtFirstName,
        lastName: req.body.txtLastName,
        email: req.body.txtEmail, 
        password: await bcrypt.hash(req.body.txtPassword, hash)     
    }); //TODO Sostituire req.body con .pick() di lodash

    await user.save();
    res.send('User Registered');
});

router.post('/api/loginUser', async (req, res) => {
    let user = await User.findOne({ email: req.body.txtEmailLogin });
    if(!user) {
        return res.status(400).send("Invalid email or password");
    }

    if(!bcrypt.compare(req.body.txtPasswordLogin, user.password)){
        return res.status(400).send('Invalid email or password');
    }
    res.send('User Logged');
    
});

module.exports = router;