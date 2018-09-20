const express = require('express');
const router = express.Router();
const { User } = require('../models/users');
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');

router.get('/:token', async (req, res) => {
    const token = req.params.token;
    const decoded = jwt.verify(token, config.get('jwtPrivateKey')); 

    const user = await User.findById(decoded._id).select({ password: 0, isAdmin: 0});

    res.render('profile', { user: user, token: token });
});

router.get('/changeName/:token', async (req, res) => {
    const token = req.params.token;
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));

    const user = await User.findById(decoded._id).select({ isAdmin: 0, password: 0 });

    res.render('profileChangeName', { user: user, token: token });
});

router.get('/changeEmail/:token', async (req, res) => {
    const token = req.params.token;
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));

    const user = await User.findById(decoded._id).select({ isAdmin: 0, firstName: 0, lastName: 0, password: 0})

    res.render('profileChangeEmail', { user: user, token: token });
});

router.post('/changeName/:token', async (req, res) => {
    const token = req.params.token;
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));

    const user = await User.findOneAndUpdate({ _id: decoded._id }, { firstName: req.body.txtFirstName, lastName: req.body.txtLastName }, { new: true });
    
    res.render('profile', { user: user, token: token });
});

router.post('/changeEmail/:token', async (req, res) => {
    const token = req.params.token;
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    const hash = await bcrypt.genSalt(10);

    if(req.body.txtNewEmail !== req.body.txtConfirmNewEmail) { 
        return res.status(400).send('The two emails are not the same'); //TODO Da cambiare
    }

    const user = await User.findById(decoded._id);

    const validPassword = await bcrypt.compare(req.body.txtPassword, user.password);
    if(!validPassword){
        return res.status(400).send('Invalid password'); //TODO Da cambiare
    }
    user.email = req.body.txtNewEmail;
    await user.save();

    res.render('profile', { user: user, token: token });
});

module.exports = router;