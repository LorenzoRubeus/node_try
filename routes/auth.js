const express = require('express');
const router = express.Router();
const { User, validateUser, validateUserLogin } = require('../models/users');
const { Category } = require('../models/categories');
const _ = require('lodash');
const bcrypt = require('bcrypt');
var token;

router.post('/', async (req, res) => {
    const { error } = validateUserLogin(req.body);
    if(error) { return res.status(400).send(error.details[0].message); } // TODO Da modificare il send con render o qualcosa

    let user = await User.findOne({ email: req.body.txtEmailLogin });
    if(!user) {
        return res.status(400).send("Invalid email or password");
    }

    const validPassword = await bcrypt.compare(req.body.txtPasswordLogin, user.password);
    if(!validPassword){
        return res.status(400).send('Invalid email or password');
    }

    let categories = await Category.find();

    token = user.generateAuthToken();
    res.header('x-auth-token', token).render('products', {categories: categories, token: token}); // TODO Da modificare il send con render o qualcosa
});

function setToken(pToken) {
    token = pToken;
}

exports.auth = router;
exports.token = token;