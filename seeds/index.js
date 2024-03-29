//just run this one time to get our data seeded

const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground'); //double dot as campground is in a directory one level down

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

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});    //empty database before adding new values
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '60d07bdeb97f6a08d09ba661', //connect all campgrounds to jog using his id at start (see id from mongoDB)
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquid sunt, error voluptate, natus deleniti obcaecati qui earum consequuntur, pariatur ratione quo suscipit! Veniam voluptas provident corporis aliquam illum velit quis.',
            price: price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude, //in geoJSON we want longitude first then latitude
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dd6eufkzk/image/upload/v1624620047/YelpCamp/wbzbwrjnivc5mmvyz8zk.jpg',
                    filename: 'YelpCamp/wbzbwrjnivc5mmvyz8zk'
                },
                {
                    url: 'https://res.cloudinary.com/dd6eufkzk/image/upload/v1624620047/YelpCamp/oin2zvkpypw95glvxytk.jpg',
                    filename: 'YelpCamp/oin2zvkpypw95glvxytk'
                }
            ]

        })      //title randomly taken using sample function
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();    //closing database connection
})