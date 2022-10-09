const express = require("express");

const router = express.Router();

const login = require("../CONTROLLERS/userControllers").login;
const signup = require("../CONTROLLERS/userControllers").signup;

router.post("/login" ,login );
router.post("/signup" , signup);


module.exports = router;
