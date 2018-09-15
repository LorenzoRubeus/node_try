const express = require('express');
const router = express.Router();
const { User, validateUser } = require('../models/users');
const _ = require('lodash');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
    /*const user = new User(
        _.pick(req.body, ['txtFirstName', 'txtLastName', 'txtEmail', 'txtPassword', 'txtConfirmPassword'])
    );*/

    const { error } = validateUser(req.body);
    if(error){ return res.status(400).send(error.details[0].message); } // TODO Da modificare il send con render o qualcosa

    let user = await User.findOne({ email: req.body.txtEmail });
    if(user) { return res.status(400).send('This email is already registered'); }  // TODO Da modificare il send con render o qualcosa

    const hash = await bcrypt.genSalt(10);
    
    user = new User({
        firstName: req.body.txtFirstName.toUpperCase(),
        lastName: req.body.txtLastName.toUpperCase(),
        email: req.body.txtEmail, 
        password: await bcrypt.hash(req.body.txtPassword, hash)     
    }); //TODO Sostituire req.body con .pick() di lodash

    await user.save();
    
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send('User Registered and logged'); // TODO Da modificare il send con render o qualcosa
});

module.exports = router;