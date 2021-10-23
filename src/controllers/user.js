const mongoose = require("mongoose");
const { User } = require("../models/user");

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
}

module.exports.registerUser = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username }); // Failing here
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
			req.flash('success', 'Register success!');
            res.redirect('/');
        })
    } catch (e) {
		req.flash('error', 'Register failure!');
        res.redirect('/register');
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
}

module.exports.loginUser = (req, res) => {
    const redirectUrl = req.session.returnTo || '/';
	delete req.session.returnTo;
	req.flash('success', 'Welcome back!');
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req, res) => {
    req.logout();
    req.flash('success', 'Farewell!');
    res.redirect('/');
}

module.exports.changeUserLangToKor = async (req, res) => {
	const user = await User.findById(req.user._id);
	user.language = "KOR";
	await User.findByIdAndUpdate(req.user._id, user);
	res.redirect('/');
}

module.exports.changeUserLangToEng = async (req, res) => {
	const user = await User.findById(req.user._id);
	user.language = "ENG";
	await User.findByIdAndUpdate(req.user._id, user);
	res.redirect('/');
}