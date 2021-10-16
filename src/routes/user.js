const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const { User } = require('../models/user');
const { isLoggedIn } = require("../utils/loginMiddleware");

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username }); // Failing here
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
			// console.log("Register success!");
            res.redirect('/');
        })
    } catch (e) {
		// console.log("Register failure!");
        res.redirect('/register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    // console.log("Login success!");
    const redirectUrl = req.session.returnTo || '/';
    // console.log(`Redirect URL is: ${redirectUrl}`);
	delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get('/logout', (req, res) => {
    req.logout();
    // console.log("Logout success!");
    res.redirect('/');
})


module.exports = router;