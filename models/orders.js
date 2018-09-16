const mongoose = require('mongoose');
const Joi = require('joi');

const ordersSchema = new mongoose.SchemaType({
    
});

const Order = mongoose.model('Order', ordersSchema);