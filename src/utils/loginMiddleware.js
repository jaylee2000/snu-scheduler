module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        console.log("Error: You must be logged in first!")
        return res.redirect('/login');
    }
    next();
}