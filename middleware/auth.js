const jwt = require('jsonwebtoken');
const config = require('config');
const Cookies = require('cookies');

module.exports = function (req, res, next) {
    var cookies = new Cookies(req, res);
    const token = cookies.get('Token', { signed: false });

    if(!token) { 
        res.render('index', { redirect: "Unauthorized", err: "Unauthorized" });
        next();
    }

    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        next();
    }
    catch(ex) {
        res.render('index', { redirect: "Unauthorized", err: "Invalid Jwt" });
    }


    /*const bearerHeader = req.headers['authorization'];
    const token = req.header('x-auth-token');
    if(!token) { return res.status(401).send('Access denied. No token provided.'); }

    try{
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        next();
    }
    catch (ex) {
        res.status(400).send('Invalid token.');
    }
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
        next();
    }*/
}