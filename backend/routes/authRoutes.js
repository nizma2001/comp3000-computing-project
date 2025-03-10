const express = require("express");

//import the controller functions to handle the routing requests
const {register, login} = require("../controllers/authController")  

const router = express.Router();



router.post("/register", register );
router.post("/login", login );



module.exports = router;