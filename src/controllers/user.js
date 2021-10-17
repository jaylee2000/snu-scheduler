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
			// console.log("Register success!");
            res.redirect('/');
        })
    } catch (e) {
		// console.log("Register failure!");
        res.redirect('/register');
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
}

module.exports.loginUser = (req, res) => {
    // console.log("Login success!");
    const redirectUrl = req.session.returnTo || '/';
    // console.log(`Redirect URL is: ${redirectUrl}`);
	delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req, res) => {
    req.logout();
    // console.log("Logout success!");
    res.redirect('/');
}