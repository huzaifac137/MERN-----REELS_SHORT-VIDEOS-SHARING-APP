const express = require("express");
const {check} = require("express-validator");

const router = express.Router();

const login = require("../CONTROLLERS/userControllers").login;
const signup = require("../CONTROLLERS/userControllers").signup;

router.post("/login" , [check("email").isEmail() , check("password").isLength({min : 6})] , login );
router.post("/signup" ,  [check("username").isLength({min:6}) , check("email").isEmail() , check("password").isLength({min:6})] , signup);


module.exports = router;
