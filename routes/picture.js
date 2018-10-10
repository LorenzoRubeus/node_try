const express = require('express');
const router = express.Router();
//const { Picture, pictureSchema } = require('../models/pictures');
const { Product } = require('../models/products');
const fs = require('file-system');
const btoa = require('btoa');

router.get('/', async (req, res) => {
    const picture = await Picture.findById("5bbd1b43df62d82058db9121");
    pictureBase64 = btoa(picture.img.data);
    res.render("provaPicture", { picture: pictureBase64 });
});

/*router.post('/:idProduct', async (req, res) => {
    let imgPath = "../node_try/public/img/pictureProducts/bed_LoriPori.png";

    let picture = new Picture;
    picture.product = "5b9e86a5cade8f0860a6aa5b";
    picture.img.data = fs.readFileSync(imgPath);
    picture.img.contentType = 'image/png';
    await picture.save();
    res.send("ciao");
});*/


router.post('/:idProduct', async (req, res) => {
    let imgPath = "../node_try/public/img/pictureProducts/bed_LoriPori.png";

    let product = await Product.findById(req.params.idProduct);
    product.img.data = fs.readFileSync(imgPath);
    product.img.contentType = 'image/png';
    await product.save();
    res.send("ciao");
});

module.exports = router;