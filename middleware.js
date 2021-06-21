module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //store url that was requested by the user
        //here req.path will just give us like /new
        //while req.originalUrl gives us our full route like /campgrounds/new
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}