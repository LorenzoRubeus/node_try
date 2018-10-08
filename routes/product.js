const express = require('express');
const router = express.Router();
const { Product } = require('../models/products');
const { Category } = require('../models/categories');
const { User } = require('../models/users');
const { Basket } = require('../models/baskets');
const { Order } = require('../models/orders');
const config = require('config');
const jwt = require('jsonwebtoken');

/*router.get('/', async (req, res) => {
    const product = await Product.find().select(
        { _id: 0, "category._id": 0, 
        "seller._id": 0, 
        "seller.isAdmin": 0
        });
    res.send(product);
});

router.get('/showProducts/:token', async (req, res) => {
    const token = req.params.token;
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));

    const products = await Product.find();
    const basket = await Basket.findOne({ customer: decoded._id });
    const categories = await Category.find();

    res.render('products', { products: products, token: token, basket: basket, categories: categories})
});*/


router.get('/filterCategory/:id/:token', async (req, res) => {
    const token = req.params.token;
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));

    const user = await User.findById(decoded._id).select({firstName: 1, lastName: 1});
    const basket = await Basket.findOne({ customer: decoded._id });
    const category = await Category.findById(req.params.id).select({ _id: 0 });
    const categories = await Category.find();
    if(!category) { return res.status(404).send('Category not found.'); }

    const products = await Product.find({ 'category.name': category.name }).select(
        {   _id: 0, 
            "category._id": 0, 
            "seller._id": 0, 
            "seller.isAdmin": 0
        });
    
    res.render('products', {user: user, basket: basket, products: products, categories: categories, token: token}); // TODO Da modificare il send con render o qualcosa
});

router.get('/showProducts/:token', async (req, res) => {
    const token = req.params.token;
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));

    const categories = await Category.find();
    const user = await User.findById(decoded._id);
    const basket = await Basket.findOne({ customer: user._id });

    //const models = getModels(req.params.token);
    const products = await Product.find();

    res.render('products', {user: user, basket: basket, categories: categories, products:products, token: token}); // TODO Da modificare il send con render o qualcosa
    //res.render('products', {user: models.user, basket: models.basket, categories: models.categories, products: products, token: req.params.token}); // TODO Da modificare il send con render o qualcosa
});

router.get('/nameCrescente/:token', async (req, res) => {
    const products = await getProductsFilter({ name: 1 });
    const models = await getModels(req.params.token);
    res.render('products', {user: models.user, basket: models.basket, categories: models.categories, products: products, token: req.params.token});
});

router.get('/nameDecrescente/:token', async (req, res) => {
    const products = await getProductsFilter({ name: -1 });
    const models = await getModels(req.params.token);
    res.render('products', {user: models.user, basket: models.basket, categories: models.categories, products: products, token: req.params.token});
});

router.get('/priceCrescente/:token', async (req, res) => {
    const products = await getProductsFilter({ price: 1 });
    const models = await getModels(req.params.token);
    res.render('products', {user: models.user, basket: models.basket, categories: models.categories, products: products, token: req.params.token});
});

router.get('/priceDecrescente/:token', async (req, res) => {
    const products = await getProductsFilter({ price: -1 });
    const models = await getModels(req.params.token);
    res.render('products', {user: models.user, basket: models.basket, categories: models.categories, products: products, token: req.params.token});
});

router.get('/showProductsByName/:sellerID/:token', async (req, res) => {
    const sellerID = req.params.sellerID;
    const products = await Product.find({ "seller._id": sellerID });
    const models = await getModels(req.params.token);
    res.render('products', {user: models.user, basket: models.basket, categories: models.categories, products: products, token: req.params.token});
});


router.post('/search/:token', async (req, res) => {
    const searchWord = req.body.txtSearchBar;
    const models = await getModels(req.params.token);
    const products = await Product.find({ $text: { $search: searchWord } });
    res.render('products', {user: models.user, basket: models.basket, categories: models.categories, products: products, token: req.params.token});
});

router.post('/', async(req, res) => {
    const category = await Category.findOne({ name: req.body.category }); //TODO IF ERROR
    
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

async function getProductsFilter(filter) {
    return await Product.find().select(
        {   _id: 0, 
            "category._id": 0, 
            "seller._id": 0, 
            "seller.isAdmin": 0
        }).sort(filter);
}  

async function getModels(token) {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    const user = await User.findById(decoded._id).select({firstName: 1, lastName: 1});
    const basket = await Basket.findOne({customer: decoded._id});
    const categories = await Category.find();
    
    var obj = {
        user: user,
        basket: basket,
        categories: categories
    }
    return obj;
}


module.exports = router;