const mongoose = require('mongoose');
const Joi = require('joi');
const { productSchema } = require('./products');
const { userSchema } = require('./users');

const ordersSchema = new mongoose.SchemaType({
    dateOrder: {
        type: Date,
        default: Date.now
    },
    product: {
        type: productSchema,
        required: true
    },
    customer: {
        type: userSchema,
        required: true
    }
});

const Order = mongoose.model('Order', ordersSchema);

exports.ordersSchema = ordersSchema;
exports.Order = Order;