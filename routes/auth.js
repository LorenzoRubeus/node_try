const express = require('express');
const router = express.Router();
const { User, validateUser } = require('../models/users');
const _ = require('lodash');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
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