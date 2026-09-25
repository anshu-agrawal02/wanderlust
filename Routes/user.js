const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/users.js");
const {isloggedin,saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/users.js")


//signup 
router.route("/signup").get(userController.signupRender).post( wrapAsync(userController.signup));

//login render
router.route("/login").get(userController.loginRender ).post(saveRedirectUrl ,
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userController.login );

//logout
router.get("/logout", userController.logout )

module.exports=router; 