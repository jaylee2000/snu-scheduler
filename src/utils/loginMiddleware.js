module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        console.log("Error: You must be logged in first!")
        return res.redirect('/login');
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const subject = await Subject.findById(id);
    if (!subject.owner.equals(req.user._id)) {
        console.log('Error: You do not have permission to do that!');
        return res.redirect("/");
    }
    next();
}

module.exports.isRestrictionOwner = async (req, res, next) => {
    const { id } = req.params;
    const restriction = await Restriction.findById(id);
    if (!subject.owner.equals(req.user._id)) {
        console.log('Error: You do not have permission to do that!');
        return res.redirect("/");
    }
    next();
}