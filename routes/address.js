const config = require('config');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const { Address, validateAddress } = require('../models/addresses');
const { User } = require('../models/users');

router.get('/:token/:btnBack', async (req, res) => {
    const token = req.params.token;
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    const btnBack = req.params.btnBack;

    const user = await User.findById(decoded._id).select({ password: 0, isAdmin: 0 });
    
    res.render('profileAddAddress', { user: user, btnBack: btnBack, token: token });



    //const address = await Address.findOne({ customer: decoded._id });
    //res.render('index', { user: user, token: token, user: address.customer.firstName })

   
});

router.post('/:token', async (req, res) => {
    const token = req.params.token;
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));

    const { error } = validateAddress(req.body);
    if(error) {
        return res.status(400).send(error.details[0].message);
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
    address = await Address.findOne({ _id: address._id }).populate('customer', {firstName: 1, lastName: 1, email: 1});

    const user = await User.findById(address.customer);
    res.render('profileAddAddress', { user: user, token: token })
});

module.exports = router;