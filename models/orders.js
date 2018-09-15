const mongoose = require('mongoose');
const Joi = require('joi');
const { userSchema } = require('./users');
const { productSchema } = require('./products');

const orderSchema = new mongoose.SchemaType({
    dateOrder: {
        type: Date,
        default: Date.now
    },
    product: {
        type: productSchema
    },
    customer: {
        type: userSchema
    }
});

const Order = mongoose.model('Order', orderSchema);

exports.Order = Order;
exports.orderSchema = orderSchema;