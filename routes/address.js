const config = require('config');
const express = require('express');
const router = express.Router();
const { Address, validateAddress } = require('../models/addresses');
const { User } = require('../models/users');
const auth = require('../middleware/auth');

router.get('/:btnBack', auth, async (req, res) => {
    const btnBack = req.params.btnBack;
    const user = await User.findById(req.user._id).select({ password: 0, isAdmin: 0 });
    
    res.render('profileAddAddress', { user: user, btnBack: btnBack });
});

router.post('/:redirect', auth, async (req, res) => {
    let err = "";

    const { error } = validateAddress(req.body);
    if(error) {
        err = error.details[0].context.label;
        return res.render('profileAddAddress', { err: err });
    }

    let address = new Address({
        customer: {
            _id: req.user._id,
        },
        name: req.body.txtName,
        street: req.body.txtStreet,
        town: req.body.txtTown,
        city: req.body.txtCity,
        country: req.body.txtCountry,
        zipCode: req.body.txtZipCode,
        phoneNumber: req.body.txtPhoneNumber
    });
    await address.save();

    //address = await Address.findOne({ _id: address._id }).populate('customer', {firstName: 1, lastName: 1, email: 1});
    //const user = await User.findById(address.customer);
    const addresses = await Address.find({ customer: req.user._id });
    
    if(req.params.redirect == "checkout") {
        return res.redirect("/api/payments/pay");
    }
    req.session.localVar = {
        address: addresses,
        changedAddress: "added"
    }
    
    res.redirect('/api/myProfile/changeAddress');
});


router.post('/deleteAddress/:idAddress', auth, async (req, res) => {
    const idAddress = req.params.idAddress;
    await Address.findByIdAndRemove(idAddress);
    const addresses = await Address.find({ customer: req.user._id });
    req.session.localVar = {
        address: addresses,
        changedAddress: "deleted"
    }

    res.redirect('/api/myProfile/changeAddress');
    //res.render('manageAddresses', { address: addresses });
});


module.exports = router;