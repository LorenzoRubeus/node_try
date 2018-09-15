const express = require('express');
const router = express.Router();
const { Category, validateCategory } = require('../models/categories');


router.post('/', async (req, res) => {

    const { error } = validateCategory(req.body);
    if(error) { return res.status(400).send(error.details[0].message); }

    const category = new Category({
        name: req.body.name
    });
    await category.save();

    res.send(category);
});

module.exports = router;