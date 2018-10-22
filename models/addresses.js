const mongoose = require('mongoose');
const Joi = require('joi');

const addressSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        minlength: 2,
        maxlength: 355,
        required: true
    },
    street: {
        type: String, 
        minlength: 2,
        maxlength: 355,
        required: true
    },
    town: {
        type: String,
        minlength: 2,
        maxlength: 355,
        require: true
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
        txtName: Joi.string().min(2).max(355).required().label("Name must be compiled and must have at least 2 characters"),
        txtStreet: Joi.string().min(2).max(355).required().label("Street name must be compiled and must have at least 2 characters"),
        txtTown: Joi.string().min(2).max(355).required().label('Town name must be compiled and must have at least 2 characters'),
        txtCity: Joi.string().min(2).max(255).required().label("City name must be compiled and must have at least 2 characters"),
        txtCountry: Joi.string().min(2).max(255).required().label("Country name must be compiled and must have at least 2 characters"),
        txtZipCode: Joi.string().min(5).max(5).regex(/^([0-9])/).required().label("Zipcode must be provided and it has to have 5 numbers only"),
        txtPhoneNumber: Joi.string().min(4).max(16).regex(/^([0-9])/).required().label("Phone number must be provided and it has to have only numbers")
    }
    return Joi.validate(address, schema);
}

exports.Address = Address;
exports.addressSchema = addressSchema;
exports.validateAddress = validateAddress;