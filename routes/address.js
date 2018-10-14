const config = require('config');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const { Address, validateAddress } = require('../models/addresses');
const { User } = require('../models/users');
const auth = require('../middleware/auth');

router.get('/:token/:btnBack', auth, async (req, res) => {
    const token = req.params.token;
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));

    const btnBack = req.params.btnBack;
    const user = await User.findById(req.user._id).select({ password: 0, isAdmin: 0 });
    
    res.render('profileAddAddress', { user: user, btnBack: btnBack, token: token });



    //const address = await Address.findOne({ customer: decoded._id });
    //res.render('index', { user: user, token: token, user: address.customer.firstName })
});

router.post('/:token', auth, async (req, res) => {
    const token = req.params.token;
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));

    let err = "";

    const { error } = validateAddress(req.body);
    if(error) {
        err = error.details[0].context.label;
        //return res.status(400).send(error.details[0].message);
        return res.render('profileAddAddress', { token: token, err: err });
    }

    let address = new Address({
        customer: {
            _id: decoded._id,
        },
        name: req.body.txtName,
        street: req.body.txtStreet,
        city: req.body.txtCity,
        country: req.body.txtCountry,
        zipCode: req.body.txtZipCode,
        phoneNumber: req.body.txtPhoneNumber
    });
    await address.save();

    //address = await Address.findOne({ _id: address._id }).populate('customer', {firstName: 1, lastName: 1, email: 1});
    //const user = await User.findById(address.customer);

    const addresses = await Address.find({ customer: req.user._id });
    
    res.render('manageAddresses', { address: addresses, token: token })
});


router.post('/deleteAddress/:token/:idProduct', auth, async (req, res) => {
    const token = req.params.token;
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));

    const idProduct = req.params.idProduct;

    await Address.findByIdAndRemove(idProduct);
    const addresses = await Address.find({ customer: req.user._id });

    res.render('manageAddresses', { address: addresses, token: token });
});


module.exports = router;