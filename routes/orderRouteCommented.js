/*router.get('/filteredByNewest', auth, async (req, res) => {
    let pictures = [];
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let dateEstimated = [];
    let dateOrder = [];
    let orders = await Order.find({ customer: req.user._id }).populate('products address').sort({ dateOrder: -1 });

    for( let i = 0; i < orders.length; i++ ) {
        dateOrder.push(getDate(orders[i].dateOrder));
    }
    for( let i = 0; i < orders.length; i++ ) {
        dateEstimated.push(getDate(orders[i].dateEstimated));
    }
    for( let i = 0; i < orders.length; i++ ) {
        pictures.push(getPictures(orders[i].products));
    } 

    req.session.localVar = {
        orders: orders,
        pictures: pictures,
        months: months,
        dateOrder: dateOrder,
        dateEstimated: dateEstimated,
        filtered: "ByNewest"
    }

    res.redirect('/api/orders');
});

router.get('/filteredByOldest', auth, async (req, res) => {
    let pictures = [];
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let dateEstimated = [];
    let dateOrder = [];
    let orders = await Order.find({ customer: req.user._id }).populate('products address').sort({ dateOrder: 1 });

    for( let i = 0; i < orders.length; i++ ) {
        dateOrder.push(getDate(orders[i].dateOrder));
    }
    for( let i = 0; i < orders.length; i++ ) {
        dateEstimated.push(getDate(orders[i].dateEstimated));
    }
    for( let i = 0; i < orders.length; i++ ) {
        pictures.push(getPictures(orders[i].products));
    } 

    req.session.localVar = {
        orders: orders,
        pictures: pictures,
        months: months,
        dateOrder: dateOrder,
        dateEstimated: dateEstimated,
        filtered: "ByOldest"
    }

    res.redirect('/api/orders');
});

router.get('/filteredBySent', auth, async (req, res) => {
    let pictures = [];
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let dateEstimated = [];
    let dateOrder = [];
    let orders = await Order.find({ customer: req.user._id }).populate('products address').sort({ dateOrder: -1 });
    let ordersFiltered = [];

    for( let i = 0; i < orders.length; i++ ) {
        if(orders[i].dateEstimated < new Date()) {
            ordersFiltered.push(orders[i]);
        }
    }

    for( let i = 0; i < ordersFiltered.length; i++ ) {
        dateOrder.push(getDate(ordersFiltered[i].dateOrder));
    }
    for( let i = 0; i < ordersFiltered.length; i++ ) {
        dateEstimated.push(getDate(ordersFiltered[i].dateEstimated));
    }
    for( let i = 0; i < ordersFiltered.length; i++ ) {
        pictures.push(getPictures(ordersFiltered[i].products));
    } 

    req.session.localVar = {
        orders: ordersFiltered,
        pictures: pictures,
        months: months,
        dateOrder: dateOrder,
        dateEstimated: dateEstimated,
        filtered: "Sent"
    }

    res.redirect('/api/orders');
});

router.get('/filteredByNotSent', auth, async (req, res) => {
    let pictures = [];
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let dateEstimated = [];
    let dateOrder = [];
    let orders = await Order.find({ customer: req.user._id }).populate('products address').sort({ dateOrder: -1 });
    let ordersFiltered = [];

    for( let i = 0; i < orders.length; i++ ) {
        if(orders[i].dateEstimated >= new Date()) {
            ordersFiltered.push(orders[i]);
        }
    }

    for( let i = 0; i < ordersFiltered.length; i++ ) {
        dateOrder.push(getDate(ordersFiltered[i].dateOrder));
    }
    for( let i = 0; i < ordersFiltered.length; i++ ) {
        dateEstimated.push(getDate(ordersFiltered[i].dateEstimated));
    }
    for( let i = 0; i < ordersFiltered.length; i++ ) {
        pictures.push(getPictures(ordersFiltered[i].products));
    } 

    req.session.localVar = {
        orders: ordersFiltered,
        pictures: pictures,
        months: months,
        dateOrder: dateOrder,
        dateEstimated: dateEstimated,
        filtered: "Not Sent"
    }

    res.redirect('/api/orders');
});*/