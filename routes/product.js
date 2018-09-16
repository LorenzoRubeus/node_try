const express = require('express');
const router = express.Router();
const { Product } = require('../models/products');
const { Category } = require('../models/categories');
const { User } = require('../models/users');

router.get('/', async (req, res) => {
    const category = await Product.find().select(
        { _id: 0, "category._id": 0, 
        "seller._id": 0, 
        "seller.isAdmin": 0
        });
    res.send(category);
});

router.get('/nameCrescente', async (req, res) => {
    const category = await Product.find().select(
        { _id: 0, "category._id": 0, 
        "seller._id": 0, 
        "seller.isAdmin": 0
        }).sort({ name: 1 });
    res.send(category);
});

router.get('/nameDecrescente', async (req, res) => {
    const category = await Product.find().select(
        { _id: 0, "category._id": 0, 
        "seller._id": 0, 
        "seller.isAdmin": 0
        }).sort({ name: -1 });
    res.send(category);
});

router.get('/priceCrescente', async (req, res) => {
    const category = await Product.find().select(
        { _id: 0, "category._id": 0, 
        "seller._id": 0, 
        "seller.isAdmin": 0
        }).sort({ price: 1 });
    res.send(category);
});

router.get('/priceDecrescente', async (req, res) => {
    const category = await Product.find().select(
        { _id: 0, "category._id": 0, 
        "seller._id": 0, 
        "seller.isAdmin": 0
        }).sort({ price: -1 });
    res.send(category);
});

router.post('/', async(req, res) => {
    const category = await Category.findOne({ name: req.body.category}); //TODO IF ERROR
    
    const user = await User.findOne({ _id: req.body.id }); //TODO IF ERROR E PRENDERE JWT TOKEN INFO

    const product = new Product({
        name: req.body.name,
        category: {
            _id: category._id,
            name: category.name
        },
        seller: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        },
        price: req.body.price,
        description: req.body.description
    });
    await product.save();

    res.send(product);
});

module.exports = router;