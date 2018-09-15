const mongoose = require('mongoose');
const Joi = require('joi');
const { categorySchema } = require('./categories');
const { userSchema } = require('./users');

const productSchema = new mongoose.SchemaType({
    name: {
        type: String,
        minlength: 2,
        maxlength: 255,
        required: true
    },
    category: {
        type: [categorySchema],
        required: true
    },
    seller: {
        type: userSchema
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