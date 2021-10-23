const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const { User } = require('../models/user');
const { isLoggedIn } = require("../utils/loginMiddleware");
const user = require("../controllers/user");

router.route("/")
	.get( (req, res) => {
		res.render('main.ejs');
	})

router.route("/register")
	.get(user.renderRegisterForm)
	.post(catchAsync(user.registerUser));

router.route("/login")
	.get(user.renderLoginForm)
	.post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), user.loginUser);

router.route("/logout")
	.get(user.logoutUser);

router.route("/kor")
	.get(user.changeUserLangToKor);

router.route("/eng")
	.get(user.changeUserLangToEng);


module.exports = router;