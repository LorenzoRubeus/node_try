const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        minlength: 4,
        maxlength: 255,
        required: true
    },
    
});