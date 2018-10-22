const config = require('config');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { User } = require('../models/users');
const { Basket } = require('../models/baskets');
const { Order } = require('../models/orders');
const { Category } = require('../models/categories');
const { Product } = require('../models/products');
const btoa = require('btoa');

router.get('/', auth, async (req, res) => {
    if(req.session.localVar) {
        let localVar = req.session.localVar;
        req.session.destroy();
        return res.render('myBasket', { removeBasket: localVar.removeBasket, user: localVar.user, basket: localVar.basket, picture: localVar.picture, count: localVar.count});
    }

    const basket = await Basket.findOne({ customer: req.user._id }).populate('products');
    const user = await User.findById(req.user._id);
    const order = await Order.findOne({ customer: req.user._id });
    const picture = getPictures(basket.products);    

    res.render('myBasket', { user: user, basket: basket, picture: picture, count: 0 });
});

router.post('/addBasket/:idProduct', auth, async (req, res) => {
    const idProduct = req.params.idProduct;

    const user = await User.findById(req.user._id );
    let basket = await Basket.findOne({ customer: req.user._id });
    const categories = await Category.find();
    let products = await Product.findById(idProduct);
    if(!products) {
        let err = "Product not available";
        basket = await Basket.findOne({ customer: req.user._id }).populate('products', { name: 1, seller: 1, price: 1, description: 1 });
        products = await Product.find();
        return res.render('products', { err: err, basket: basket, products: products, categories: categories })
    }

    basket.count++;
    basket.price += products.price;
    basket.products.push(idProduct);
    basket = await basket.save();   
    basket = await Basket.findOne({ customer: req.user._id }).populate('products', { name: 1, seller: 1, price: 1, description: 1 });

    products = await Product.find();
    const pictures = getPictures(products);

    req.session.localVar = {
        user: user,
        basket: basket,
        pictures: pictures,
        categories: categories,
        basket: basket,
        products: products,
        addBasket: true
    }
    res.redirect('/api/products/showProducts');
});

router.post('/removeProductBasket/:idProduct/:idProductRemove', auth, async (req, res) => {
    const idProduct = req.params.idProduct;
    const idProductRemove = req.params.idProductRemove;
    const user = await User.findById(req.user._id);
    let basket = await Basket.findOne({ customer: req.user._id }).populate('products', { name: 1, seller: 1, price: 1, description: 1, img: 1 });
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
    req.session.localVar = {
        user: user,
        picture: picture,
        basket: basket,
        removeBasket: true,
        count: 0
    }

    res.redirect('/api/basket');
}); 

function getPictures(products) {
    let pictures = [];
    for(let i = 0; i < products.length; i++) {
        pictures.push(btoa(products[i].img.data));
    }
    return pictures;
}

module.exports = router;