const mongoose = require('mongoose');
const Joi = require('joi');

const addressSchema = new mongoose.SchemaType({
    name: {
        type: String,
        minlength: 2,
        maxlength: 255,
        required: true
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