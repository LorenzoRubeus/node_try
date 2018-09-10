const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        minlength: 4,
        maxlength: 255,
        required: true
    },
    lastName: {
        type: String,
        minlength: 4,
        maxlength: 255,
        required: true
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        requied: true,
        minlength: 5,
        maxlength: 1024
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

const User = mongoose.model('User', userSchema);


function validateUser(user){
    const schema = {
        firstName: Joi.String().min(4).max(255).required(),
        lastName: Joi.String().min(4).max(255).required(),
        email: Joi.String().min(5).max(255).required().email(),
        password: Joi.String().min(5).max(255).required()
    }
    return Joi.validate(user, schema);
}


exports.User = User;
exports.validateUser = validateUser;