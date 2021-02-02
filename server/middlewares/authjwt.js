const jsonwebtoken = require('jsonwebtoken');
const config = require('../config');
const db = require("../models/index");

module.exports = (req, res, next) => {
    const { authorization } = req.headers

    jsonwebtoken.verify(authorization, config.secretKey, async (err, decodedToken) => {
        if (err || !decodedToken) {
            req.creator = null;
            return next()
        }
        if (req.session && req.session.user) {
            return next();
        } else {
            req.creator = decodedToken.id
            req.session.user = await db["User"].findOne({
                where: { id: decodedToken.id },
                include: db["Permission"],
            });
            next();
        }
    })
};
