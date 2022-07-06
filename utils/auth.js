const withAuth = (req, res, next) => {
    if (!req.session.loggedIn) {
        return res.redirect('/login');
    }
    return next();
}

module.exports = withAuth;