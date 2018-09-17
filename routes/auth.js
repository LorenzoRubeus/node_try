const express = require('express');
const router = express.Router();
const { User, validateUser, validateUserLogin } = require('../models/users');
const { Category } = require('../models/categories');
const _ = require('lodash');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {

    const { error } = validateUserLogin(req.body);
    if(error) { return res.status(400).send(error.details[0].message); } // TODO Da modificare il send con render o qualcosa

    let user = await User.findOne({ email: req.body.txtEmailLogin });
    if(!user) {
        return res.status(400).send("Invalid email or password");
    }

    if(!bcrypt.compare(req.body.txtPasswordLogin, user.password)){
        return res.status(400).send('Invalid email or password');
    }

    let categories = await Category.find();

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).render('products', {categories: categories}); // TODO Da modificare il send con render o qualcosa
});

module.exports = router;