const mongoose = require('mongoose');
const Joi = require('joi');
const { categorySchema } = require('./categories');
const { userSchema } = require('./users');
const moment = require('moment');

const productSchema = new mongoose.Schema({
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
        default: Date.now
    },
    description: {
        type: String,
        minlength: 4,
        maxlength: 65536,
        required: true
    }
});

const Product = mongoose.model('Product', productSchema);

exports.Product = Product;
exports.productSchema = productSchema;