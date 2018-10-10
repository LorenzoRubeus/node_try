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
        required: true,
        text: true
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
        default: moment(new Date()).add(3, 'days')
    },
    description: {
        type: String,
        minlength: 4,
        maxlength: 65536,
        required: true
    },
    img: {
        data: Buffer,
        contentType: String
    }
});

const Product = mongoose.model('Product', productSchema);

exports.Product = Product;
exports.productSchema = productSchema;