const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require("./models/campground");

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({ extended: true }));    //to handle post requests as our res.body will be empty otherwise,here we parse it


app.get('/', (req, res) => {
    res.render('home');
});


app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
});


//order matters,this should be before the ':id' one
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});


app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground); //our body gets a campground object as the name specified in the get form was campground[title] kinda
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
});


app.get('/campgrounds/:id', async (req, res,) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show', { campground });
});


app.listen(3000, () => {
    console.log('Serving on port 3000');
})