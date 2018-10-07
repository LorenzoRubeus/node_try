const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    cardHolder: {
        type: String,
        minlength: 3,
        maxlength: 16,
        required: true
    },
    cardCircuit: {
        type: String,
        min: 1,
        required: true
    },
    cardNumber: {
        type: String,
        min: 1,
        required: true
    },
    monthExpired: {
        type: Number,
        min: 1,
        max: 12,
        required: true
    },
    yearExpired: {
        type: Number,
        min: new Date().getFullYear(),
        max: 2030,
        required: true
    }
});

const Payment = mongoose.model('Payment', paymentSchema);

exports.paymentSchema = paymentSchema;
exports.Payment = Payment;