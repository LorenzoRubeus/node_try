const express = require('express');
const router = express.Router();
const { User } = require('../models/users');
const { Address } = require('../models/addresses');
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

    const user = await User.findById(decoded._id).select({ isAdmin: 0, password: 0})

    res.render('profileChangeEmail', { user: user, token: token });
});

router.get('/changePassword/:token', async (req, res) => {
    const token = req.params.token;
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));

    const user = await User.findById(decoded._id).select({ isAdmin: 0, password: 0});
    res.render('profileChangePassword', { user: user, token: token });
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


router.get('/changeAddress/:token', async (req, res) => {
    const token = req.params.token;
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));

    const address = await Address.find({ customer: decoded._id });
    //const address = await Address.findOne({ customer: decoded._id });
    const user = await User.findOne({ _id: address.customer }).select({ password: 0, isAdmin: 0});

    
    //res.render('profileChangeAddress', { address: address, user: user, token: token });
    res.render('manageAddresses', { address: address, user: user, token: token });
});

router.get('/changeAddress/pick/:token/:id', async (req, res) => {
    const token = req.params.token;
    const id = req.params.id;

    const address = await Address.findOne({ _id: id });
    
    res.render('profileChangeAddress', { address: address, token: token });

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

router.post('/changePassword/:token', async (req, res) => {
    const token = req.params.token;
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    const hash = await bcrypt.genSalt(10);

    if(req.body.txtPassword !== req.body.txtConfirmPassword) {
        return res.status(400).send('The passwords do not correspond'); //TODO Da cambiare
    }

    const user = await User.findById(decoded._id);    

    const validPassword = await bcrypt.compare(req.body.txtOldPassword, user.password);
    if(!validPassword) {
        return res.status(400).send('Your current password is wrong'); //TODO Da cambiare
    }

    user.password = await bcrypt.hash(req.body.txtPassword, hash);
    await user.save();

    res.render('profile', { user: user, token: token});
});

router.post('/changeAddress/:token/:id', async (req, res) => {
    const token = req.params.token;
    const id = req.params.id;
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));

    let address = await Address.findOneAndUpdate({ customer: decoded._id, _id: id }, {
        name: req.body.txtName,
        street: req.body.txtStreet,
        city: req.body.txtCity,
        ZipCode: req.body.txtZipCode,
        PhoneNumber: req.body.txtPhoneNumber
    }, { new: true });
    
    //const user = await User.findById(address.customer);
    //res.render('profile', { user: user, token: token });
    address = await Address.find();

    res.render('manageAddresses', { address: address, token: token });
});


module.exports = router;