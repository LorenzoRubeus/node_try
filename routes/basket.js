const config = require('config');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const { User } = require('../models/users');
const { Basket } = require('../models/baskets');
const { Order } = require('../models/orders');
const { Category } = require('../models/categories');
const { Product } = require('../models/products');
const btoa = require('btoa');

router.get('/:token', async (req, res) => {
    const token = req.params.token;
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));

    const basket = await Basket.findOne({ customer: decoded._id }).populate('products');
    const user = await User.findById(decoded._id);
    const order = await Order.findOne({ customer: decoded._id });

    const picture = getPictures(basket.products);    

    res.render('myBasket', { user: user, basket: basket, picture: picture, count: 0, token: token });
});

router.post('/addBasket/:idProduct/:token', async (req, res) => {
    const token = req.params.token;
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    const idProduct = req.params.idProduct;

    const user = await User.findById(decoded._id);
    let basket = await Basket.findOne({ customer: decoded._id });
    const categories = await Category.find();
    let products = await Product.findById(idProduct);
    if(!products) {
        let err = "Product not available";
        basket = await Basket.findOne({ customer: decoded._id }).populate('products', { name: 1, seller: 1, price: 1, description: 1 });
        products = await Product.find();
        return res.render('products', { token: token, err: err, basket: basket, products: products, categories: categories,})
    }

    basket.count++;
    basket.price += products.price;
    basket.products.push(idProduct);
    basket = await basket.save();   
    basket = await Basket.findOne({ customer: decoded._id }).populate('products', { name: 1, seller: 1, price: 1, description: 1 });

    products = await Product.find();
    const pictures = getPictures(products);
    res.render('products', { user: user, products: products, pictures: pictures, categories: categories, token: token, basket: basket });
});

router.post('/removeProductBasket/:idProduct/:token/:idProductRemove', async (req, res) => {
    const token = req.params.token;
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    const idProduct = req.params.idProduct;
    const idProductRemove = req.params.idProductRemove;
    const user = await User.findById(decoded._id);
    let basket = await Basket.findOne({ customer: decoded._id }).populate('products', { name: 1, seller: 1, price: 1, description: 1 });
    basket.price = basket.price - basket.products[idProductRemove].price;

    if(basket.products.length == 1) { 
        basket.products.pull({ _id: idProduct }); 
    }
    else { 
        basket.products.splice(idProductRemove, 1); 
    }

    basket.count--;
    basket = await basket.save();

    const picture = getPictures(basket.products);

    res.render('myBasket', { user: user, count: 0, token: token, picture: picture, basket: basket });
}); 

function getPictures(products) {
    let pictures = [];
    for(let i = 0; i < products.length; i++) {
        pictures.push(btoa(products[i].img.data));
    }
    return pictures;
}


module.exports = router;