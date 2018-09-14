const mongoose = require('mongoose');
const Joi = require('joi');

const productSchema = new mongoose.SchemaType({
    name: {
        type: String,
        minlength: 2,
        maxlength: 255,
        required: true
    },
    price: {
        type: Number,
        min: 0.01,
        required: true
    },
    estimatedTime: {
        type: Date,
        default: Date.now,
        required: true,
    },
    description: {
        type: String,
        minlength: 4,
        maxlength: 65536,
        required: true
    }

});