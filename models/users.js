const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
//const { paymentSchema } = require('./payments');
const { addressSchema } = require('./addresses');


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        minlength: 4,
        maxlength: 255,
        required: true
    },
    lastName: {
        type: String,
        minlength: 4,
        maxlength: 255,
        required: true
    },
    email: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true
    },
    password: {
        type: String,
        requied: true,
        minlength: 5,
        maxlength: 1024
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    address: {
        type: addressSchema
    }
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user){
    const schema = {
        txtFirstName: Joi.string().min(4).max(255).required().label("First name must be compiled and must have at least 4 characters"),
        txtLastName: Joi.string().min(4).max(255).required().label("Last name must be compiled and must have at least 4 characters"),
        txtEmail: Joi.string().min(5).max(255).required().email().label("Email must be a valid email address and must have at least 5 characters"),
        txtPassword: Joi.string().min(5).max(255).required().label("Password must be compiled and must have at least 5 characters"),
        txtConfirmPassword: Joi.string().min(5).max(255).required().label("You need to confirm the password you want to use"),
    }
    return Joi.validate(user, schema);
}

function validateUserLogin(user){
    const schema = {
        txtEmailLogin: Joi.string().min(4).max(255).required().label("Email must be a valid email address and must have at least 5 characters"),
        txtPasswordLogin: Joi.string().min(5).max(255).required().label("Password must be compiled and must have at least 5 characters")
    }

    return Joi.validate(user, schema);
}


exports.User = User;
exports.userSchema = userSchema;
exports.validateUser = validateUser;
exports.validateUserLogin = validateUserLogin;