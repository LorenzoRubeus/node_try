const mongoose = require('mongoose');
const Joi = require('joi');

const ordersSchema = new mongoose.Schema({
    dateOrder: {
        type: Date,
        default: Date.now
    },
    products: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Product'
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Order = mongoose.model('Order', ordersSchema);

exports.ordersSchema = ordersSchema;
exports.Order = Order;