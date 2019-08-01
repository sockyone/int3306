const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] == 'Bearer') {
        let token = req.headers.authorization.split(' ')[1];
        if (!token) {
            res.json({
                code: false,
                reason: "Validate token fail",
                payload: {}
            });
            return;
        }
        let valid = jwt.verify(token, config.get('secretKey'));
        if (!valid) {
            res.json({
                code: false,
                reason: "Validate token fail",
                payload: {}
            });
            return;
        } else {
            req.body.idUser = valid.idUser;
            next();
            return;
        }

    } else {
        res.json({
            code: false,
            reason: "Validate token fail",
            payload: {}
        });
        return;
    }
};