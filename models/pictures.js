const mongoose = require('mongoose');

const pictureSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    img: [{
        data: Buffer,
        contentType: String
    }]
});

const Picture = mongoose.model('Picture', pictureSchema);

exports.pictureSchema = pictureSchema;
exports.Picture = Picture;