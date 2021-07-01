if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const helmet = require("helmet");

//sanitizes user-supplied data to prevent MongoDB Operator Injection.
const mongoSanitize = require('express-mongo-sanitize');

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

const MongoStore = require("connect-mongo");


const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({ extended: true }));    //to handle post requests as our res.body will be empty otherwise,here we parse it
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

// To remove data, use:
app.use(mongoSanitize());

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

//see connect-mongo docs for this ,it is different in video due to older version
const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60    //in seconds
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})


const sessionConfig = {
    store,
    name: 'session',    //easy basic protection
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,   //to make work only with https (localhost is not http so we dont want this right now but only after deploying)
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,      //date.now() returns milliseconds,so according to that we calculate the ms to expire it after a week
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());

app.use(helmet({ contentSecurityPolicy: false, }));

app.use(passport.initialize());
app.use(passport.session());    //to use persistent login
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());   //to serialise user into session
passport.deserializeUser(User.deserializeUser());   //to deserialise users out of session


app.use((req, res, next) => {
    // console.log(req.session)
    res.locals.currentUser = req.user;  //to keep track if user is logged in or not (we use this in navbar.ejs partial)
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)   //to access :id in our routes,we need to set mergeParams : true in that file


app.get('/', (req, res) => {
    res.render('home');
});


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on port 3000');
})