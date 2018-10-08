const express = require('express');
const router = express.Router();
const { User, validateUser } = require('../models/users');
const { Order } = require('../models/orders');
const { Basket } = require('../models/baskets');
const _ = require('lodash');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
    /*const user = new User(
        _.pick(req.body, ['txtFirstName', 'txtLastName', 'txtEmail', 'txtPassword', 'txtConfirmPassword'])
    );*/
    let err = ""

    const { error } = validateUser(req.body);
    if(error){
        /*err = "Missing Field"; 
        return res.render('index', { err: err }).status(404);*/
        /*err = error.details[0].message;
        return res.render('index', { err: err }).status(404);*/

        return res.send(error).status(404);
    } 

    let user = await User.findOne({ email: req.body.txtEmail });
    if(user) { 
        err = "User Registered"
        return res.render('index', { err: err }).status(400); 
    }  

    const firstName = req.body.txtFirstName[0].toUpperCase() + req.body.txtFirstName.slice(1, req.body.txtFirstName.length).toLowerCase();
    const lastName = req.body.txtLastName[0].toUpperCase() + req.body.txtLastName.slice(1, req.body.txtLastName.length).toLowerCase();
    const hash = await bcrypt.genSalt(10);

    user = new User({
        firstName: firstName,
        lastName: lastName,
        email: req.body.txtEmail, 
        password: await bcrypt.hash(req.body.txtPassword, hash)     
    }); //TODO Sostituire req.body con .pick() di lodash
    await user.save();
    
    let order = new Order({
        customer: {
            _id: user._id
        }
    });
    await order.save();
    order = await Order.findOne({ _id: order._id }).populate('customer', { firstName: 1, lastName: 1, email: 1 });

    let basket = new Basket({
        customer: {
            _id: user._id
        }
    });
    await basket.save();
    basket = await Basket.findOne({ _id: basket._id }).populate('customer', { firstName: 1, lastName: 1, email: 1 });

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send('User Registered and logged'); // TODO Da modificare il send con render o qualcosa
});


module.exports = router;