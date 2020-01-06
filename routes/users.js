const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const jwt_decode = require('jwt-decode');
// Get Models
const { Users, regValidate, logValidate } = require("../models/Users");
/**
 * Get
 * Simple Hello
 */
router.get("/", (req, res) => {
    res.send("Hello users api");
});
/**
 * POST
 * Register users
 */
router.post("/register", (req, res) => {
    // Validation
    const { error } = regValidate(req.body);
    if (error) {
        return res.status(400).json({
            status: "error",
            type: error.details[0].path[0],
            msg: error.details[0].message
        });
    }
    // New Object
    const newUser = new Users({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });
    // Check email is registered already or not
    Users.findOne({ email: req.body.email }).then(emailMatch => {
        if (emailMatch) {
            return res.status(400).json({
                status: "error",
                type: "email",
                msg: "Email is already registered"
            });
        }
        // Check username is taken or not
        Users.findOne({ username: req.body.username }).then(username => {
            if (username) {
                return res.status(400).json({
                    status: "error",
                    type: "username",
                    msg: "Username is already taken."
                });
            }
            // Now Hash the password using bcrypt
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    // Saving to db
                    newUser
                        .save()
                        .then((port) => res.json(port))
                        .catch(err => console.error(err));
                })
            });
        });
    });
});

/**
 * POST
 * Login users
 */
router.post('/login', (req, res) => {
        // Validation
        const { error } = logValidate(req.body);
        if (error) {
            return res.status(400).json({
                status: "error",
                type: error.details[0].path[0],
                msg: error.details[0].message
            });
        }
        // check email exist or not
        Users.findOne({ email: req.body.email }).then(user => {
            if (!user) {
                return res.status(400).json({
                    status: "error",
                    type: "email",
                    msg: "Email is not registered."
                });
            }
            // Check password using brypt
            bcrypt.compare(req.body.password, user.password).then(isMatch => {
                if (isMatch) {
                    // generate token using jsonwebtoken
                    const payload = {
                        id: user.id,
                        username: user.username,
                        email: user.email
                    };

                    jwt.sign(payload, keys.secretKey, { expiresIn: 3600 }, (err, token) => {
                        // How to get user from token
                        const decode = jwt_decode(token);
                        res.json({
                            success: true,
                            token: "Bearer " + token,
                            decode: decode
                        });
                    });
                } else {
                    return res.status(400).json({
                        status: "error",
                        type: "password",
                        msg: "Password is incorrect."
                    });
                }
            })
        })
    })
    // Export
module.exports = router;