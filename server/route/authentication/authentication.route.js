const router = require('express').Router();
const User = require('./../../model/user.model');
const config = require('config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const tokenCheck = require('./../../helper/authenticate.middleware');

router.post("/login", async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    User.findOne({username: username}, async (err, result)=>{
        if (err) {
            res.json({
                code: false,
                reason: "Can not connect to database",
                payload: {}
            });
        } else {
            if (result) {
                let match = await bcrypt.compareSync(password, result.password);
                if (match) {
                    res.json({
                       code: true,
                       reason: "Login successfully",
                       payload: {
                           token: jwt.sign({
                               idUser: result._id
                           }, config.get('secretKey'), {expiresIn: '1d'}),
                           firstName: result.firstName,
                           lastName: result.lastName
                       }
                    });
                } else {
                    res.json({
                        code: false,
                        reason: "Password not match",
                        payload: {}
                    });
                }
            } else {
                res.json({
                    code: false,
                    reason: "User not exist",
                    payload: {}
                });
            }
        }
    });
});

router.post("/sign", (req, res) => {
    //check username
    let username = req.body.username;
    User.findOne({username: username}, (err, result)=>{
        if (err) {
            res.json({
                code: false,
                reason: "Can not connect to database",
                payload: {}
            });
        } else {
            if (result) {
                res.json({
                    code: false,
                    reason: "Username exist",
                    payload: {}
                });
            } else {
                let newUser = new User(req.body);
                newUser.password = bcrypt.hashSync(newUser.password, config.saltRounds);
                newUser.save((err)=>{
                    if (err) {
                        res.json({
                           code: false,
                           reason: "Fail to save into database",
                           payload: {}
                        });
                    } else {
                        res.json({
                            code: true,
                            reason: "Create account successfully",
                            payload: {}
                        });
                    }
                });
            }
        }
    });
});

router.post("/get-name", tokenCheck, (req, res)=>{
    User.findById(req.body.idUser, (err, rs)=>{
        if (err) {
            res.json({
                code: false,
                reason: "Can not connect to database",
                payload: {}
            });
        } else {
            if (rs) {
                res.json({
                    code: true,
                    reason: "Successfully",
                    payload: {
                        firstName: rs.firstName,
                        lastName: rs.lastName
                    }
                });
            } else {
                res.json({
                    code: false,
                    reason: "User not exist",
                    payload: {}
                });
            }
        }
    });
});

//
module.exports = router;