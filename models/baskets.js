const mongoose = require('mongoose');

const basketSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    products: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
    }],
    count: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        min: 0,
        default: 0
    }
});   

const Basket = mongoose.model('Basket', basketSchema);

exports.Basket = Basket;