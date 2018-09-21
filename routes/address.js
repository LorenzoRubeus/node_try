const config = require('config');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const { Address } = require('../models/addresses');

router.post('/:token', async (req, res) => {
    const token = req.params.token;
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));

    let address = new Address({
        customer: {
            _id: decoded._id,
        },
        street: req.body.txtStreet,
        city: req.body.txtCity,
        country: req.body.txtCountry,
        zipCode: req.body.txtZipCode,
        phoneNumber: req.body.txtPhoneNumber
    });

    await address.save();
    address = await Address.findOne({ _id: address._id }).populate('customer', {firstName: 1, lastName: 1, email: 1});

    res.send(address);
});

module.exports = router;