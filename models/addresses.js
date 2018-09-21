const mongoose = require('mongoose');
const Joi = require('joi');
const { User } = require('./users');

const addressSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    street: {
        type: String, 
        minlength: 2,
        maxlength: 355,
        required: true
    },
    city: {
        type: String, 
        minlength: 2,
        maxlength: 255,
        required: true
    },
    country: {
        type: String,
        minlength: 2,
        maxlength: 255,
        required: true
    },
    zipCode: {
        type: String,
        minlength: 5,
        maxlength: 5,
        required: true
    },
    phoneNumber: {
        type: String,
        minlength: 4,
        maxlength: 16,
        required: true
    }
});

const Address = mongoose.model('Address', addressSchema);

function validateAddress(address){
    const schema = {
        txtStreet: Joi.string().min(2).max(355).required(),
        txtCity: Joi.string().min(2).max(255).required(),
        txtCountry: Joi.string().min(2).max(255).required(),
        txtZipCode: Joi.string().min(5).max(5).required(),
        txtPhoneNumber: Joi.string().min(4).max(16).required()
    }

    return Joi.validate(address, schema);
}

exports.Address = Address;
exports.addressSchema = addressSchema;
exports.validateAddress = validateAddress;