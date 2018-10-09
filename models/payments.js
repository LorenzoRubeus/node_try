const mongoose = require('mongoose');
const Joi = require('joi');

const paymentSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    cardHolder: {
        type: String,
        minlength: 3,
        maxlength: 255,
        required: true
    },
    cardCircuit: {
        type: String,
        min: 1,
        max: 255,
        required: true
    },
    cardNumber: {
        type: String,
        min: 1,
        max: 16,
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

function validatePayment(payment) {
    const schema = {
        txtCardHolder: Joi.string().min(3).max(255).required().label("Card owner's name must be provided and must have at least 3 characters"),
        selCardCircuit: Joi.string().min(1).max(255).required().label("Card circuit must be provided"),
        txtCardNumber: Joi.string().min(1).max(16).regex(/^([0-9])/).required().label("Card number must be provided and it has to have only numbers"),
        txtMonthExpired: Joi.number().min(1).max(12).required().label("Expiration month must be provided"),
        txtYearExpired: Joi.number().min(new Date().getFullYear()).max(2030).required().label(`Expiration year must be provided and it has to be between ${new Date().getFullYear()} and 2030`)
    }
    return Joi.validate(payment, schema);
}

exports.paymentSchema = paymentSchema;
exports.Payment = Payment;
exports.validatePayment = validatePayment;