const express = require('express');
const router = express.Router();
const { Product } = require('../models/products');

router.get('/', async (req, res) => {
    const product = await Product.find();
    res.send(product);
});

/*router.post('/', async(req, res) => {
    const product = new Product({
        name: req.body.name,
        category: req.body.category,
        seller: {
            req
        }
    });
});*/

module.exports = router;