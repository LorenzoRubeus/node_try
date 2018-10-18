const express = require('express');
const router = express.Router();
const { Product } = require('../models/products');
const { Category } = require('../models/categories');
const { User } = require('../models/users');
const { Basket } = require('../models/baskets');
const { Order } = require('../models/orders');
const config = require('config');
const btoa = require('btoa');
const auth = require('../middleware/auth');

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


router.get('/filterCategory/:id', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select({firstName: 1, lastName: 1});
    const basket = await Basket.findOne({ customer: req.user._id });
    const category = await Category.findById(req.params.id).select({ _id: 0 });
    const categories = await Category.find();
    if(!category) { return res.status(404).send('Category not found.'); }

    const products = await Product.find({ 'category.name': category.name }).select(
        {   _id: 0, 
            "category._id": 0, 
            "seller._id": 0, 
            "seller.isAdmin": 0
        });
    const pictures = getPictures(products);
    res.render('products', { user: user, basket: basket, pictures: pictures, products: products, categories: categories }); // TODO Da modificare il send con render o qualcosa
});

router.get('/showProducts', auth, async (req, res) => {
    if(req.session.localVar) {
        let localVar = req.session.localVar;
        req.session.destroy();
        return res.render('products', { user: localVar.user, basket: localVar.basket, pictures: localVar.pictures, categories: localVar.categories, products: localVar.products }); // TODO Da modificare il send con render o qualcosa
    }

    const categories = await Category.find();
    const user = await User.findById(req.user._id);
    const basket = await Basket.findOne({ customer: req.user._id });
    const products = await Product.find();
    const pictures = getPictures(products);
    res.render('products', { user: user, basket: basket, pictures: pictures, categories: categories, products: products }); // TODO Da modificare il send con render o qualcosa
    //const models = getModels(req.params.token);
    //res.render('products', {user: models.user, basket: models.basket, categories: models.categories, products: products, token: req.params.token}); // TODO Da modificare il send con render o qualcosa
});

router.get('/nameCrescente', auth, async (req, res) => {
    const products = await getProductsFilter({ name: 1 });
    const models = await getModels(req.user);
    const pictures = getPictures(products);
    res.render('products', { user: models.user, basket: models.basket, pictures: pictures, categories: models.categories, products: products });
});

router.get('/nameDecrescente', auth, async (req, res) => {
    const products = await getProductsFilter({ name: -1 });
    const models = await getModels(req.user);
    const pictures = getPictures(products);
    res.render('products', { user: models.user, basket: models.basket, pictures: pictures, categories: models.categories, products: products });
});

router.get('/priceCrescente', auth, async (req, res) => {
    const products = await getProductsFilter({ price: 1 });
    const models = await getModels(req.user);
    const pictures = getPictures(products);
    res.render('products', { user: models.user, basket: models.basket, pictures: pictures, categories: models.categories, products: products });
});

router.get('/priceDecrescente', auth, async (req, res) => {
    const products = await getProductsFilter({ price: -1 });
    const models = await getModels(req.user);
    const pictures = getPictures(products);
    res.render('products', { user: models.user, basket: models.basket, pictures: pictures, categories: models.categories, products: products });
});

router.get('/showProductsByName/:sellerID', auth, async (req, res) => {
    const sellerID = req.params.sellerID;
    const products = await Product.find({ "seller._id": sellerID });
    const models = await getModels(req.user);
    const pictures = getPictures(products);
    res.render('products', { user: models.user, basket: models.basket, pictures: pictures, categories: models.categories, products: products });
});


router.post('/search', auth, async (req, res) => {
    const searchWord = req.body.txtSearchBar;
    const models = await getModels(req.user);
    const products = await Product.find({ $text: { $search: searchWord } });
    const pictures = getPictures(products);
    res.render('products', { user: models.user, basket: models.basket, pictures: pictures, categories: models.categories, products: products });
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

/*async function getModels(token) {
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
}*/

async function getModels(userp) {
    const user = userp;
    const basket = await Basket.findOne({customer: user._id});
    const categories = await Category.find();
    
    var obj = {
        user: user,
        basket: basket,
        categories: categories
    }
    return obj;
}

function getPictures(products) {
    let pictures = [];
    for(let i = 0; i < products.length; i++) {
        pictures.push(btoa(products[i].img.data));
    }
    return pictures;
}

module.exports = router;