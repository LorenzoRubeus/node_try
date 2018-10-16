const express = require('express');
const router = express.Router();
const { User } = require('../models/users');
const { Address, validateAddress } = require('../models/addresses');
const { Order } = require('../models/orders');
const { Basket } = require('../models/baskets');
const config = require('config');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const Cookies = require('cookies');
const jwt = require('jsonwebtoken');

router.get('/', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select({ password: 0, isAdmin: 0});

    res.render('profile', { user: user });
});

router.get('/changeName', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select({ isAdmin: 0, password: 0 });

    res.render('profileChangeName', { user: user });
});

router.get('/changeEmail', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select({ isAdmin: 0, password: 0})

    res.render('profileChangeEmail', { user: user });
});

router.get('/changePassword', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select({ isAdmin: 0, password: 0});
    res.render('profileChangePassword', { user: user });
});

/*router.get('/changeAddress/:token', async (req, res) => {
    const token = req.params.token;
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));

    const address = await Address.find({ customer: decoded._id });
    //const address = await Address.findOne({ customer: decoded._id });
    const user = await User.findOne({ _id: address.customer }).select({ password: 0, isAdmin: 0});

    
    //res.render('profileChangeAddress', { address: address, user: user, token: token });
    res.render('manageAddresses', { address: address, user: user, token: token });
});*/


router.get('/changeAddress/', auth, async (req, res) => {
    const address = await Address.find({ customer: req.user._id });
    //const address = await Address.findOne({ customer: decoded._id });
    const user = await User.findOne({ _id: address.customer }).select({ password: 0, isAdmin: 0});

    
    //res.render('profileChangeAddress', { address: address, user: user });
    res.render('manageAddresses', { address: address, user: user });
});

router.get('/changeAddress/pick/:id', auth, async (req, res) => {
    const id = req.params.id;
    const address = await Address.findOne({ _id: id });
    
    res.render('profileChangeAddress', { address: address });
});


router.post('/changeName', auth, async (req, res) => {
    let err = "";

    if(typeof req.body.txtFirstName !== "string" || req.body.txtFirstName.length < 2) {
        err = "First name error";
        let user = await User.findById(req.user._id).select({ isAdmin: 0, password: 0 });
        return res.render('profileChangeName', { err: err, user: user });
    }

    if(typeof req.body.txtLastName !== "string" || req.body.txtLastName.length < 2) {
        err = "Last name error";
        let user = await User.findById(req.user._id).select({ isAdmin: 0, password: 0 });
        return res.render('profileChangeName', { err: err, user: user });
    }

    const user = await User.findOneAndUpdate({ _id: req.user._id }, { firstName: req.body.txtFirstName, lastName: req.body.txtLastName }, { new: true });
    
    res.render('profile', { user: user });
});

router.post('/changeEmail', auth, async (req, res) => {
    let err = "";

    let user = await User.findById(req.user._id);

    if(req.body.txtNewEmail !== req.body.txtConfirmNewEmail) { 
        err = "Email no match";
        return res.render('profileChangeEmail', { err: err, user: user })
    }

    if(typeof req.body.txtNewEmail !== "string" || req.body.txtNewEmail.length < 6) {
        err = "Email few characters";
        return res.render('profileChangeEmail', { err: err, user: user});
    }

    const validPassword = await bcrypt.compare(req.body.txtPassword, user.password);
    if(!validPassword){
        err = "Email wrong password"
        return res.render('profileChangeEmail', { err: err, user: user});
    }

    user.email = req.body.txtNewEmail;
    await user.save();

    res.render('profile', { user: user });
});

router.post('/changePassword', auth, async (req, res) => {
    const hash = await bcrypt.genSalt(10);
    let err = "";

    if(req.body.txtPassword !== req.body.txtConfirmPassword) {
        err = "Password no match";
        return res.render('profileChangePassword', { err: err });
    }
    if(req.body.txtPassword.length < 6) {
        err = "Password too short";
        return res.render('profileChangePassword', { err: err });
    }

    let user = await User.findById(req.user._id);    
    const validPassword = await bcrypt.compare(req.body.txtOldPassword, user.password);
    if(!validPassword) {
        err = "Wrong current password";
        return res.render('profileChangePassword', { err: err });
    }
    user.password = await bcrypt.hash(req.body.txtPassword, hash);
    await user.save();

    res.render('profile', { user: user });
});

router.post('/changeAddress/:id', auth, async (req, res) => {
    const id = req.params.id;
    let err = "";

    const { error } = validateAddress(req.body);
    if(error) {
        err = error.details[0].context.label;
        let address = await Address.findOne({ _id: id });
        return res.render("profileChangeAddress", { err: err, address: address });
    }

    let address = await Address.findOneAndUpdate({ customer: req.user._id, _id: id }, {
        name: req.body.txtName,
        street: req.body.txtStreet,
        city: req.body.txtCity,
        ZipCode: req.body.txtZipCode,
        PhoneNumber: req.body.txtPhoneNumber
    }, { new: true });
    
    //const user = await User.findById(address.customer);
    //res.render('profile', { user: user, token: token });
    address = await Address.find({ customer: req.user._id });

    res.render('manageAddresses', { address: address });
});

router.post('/deleteAccount', auth, async (req, res) => {
    let cookies = new Cookies(req, res);
    const token = cookies.get('Token', { signed: false });
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));

    cookies.set('Token');

});

module.exports = router;