const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

// https://res.cloudinary.com/douqbebwk/image/upload/w_300/v1600113904/YelpCamp/gxgle1ovzd2f3dgcpass.png

const ImageSchema = new Schema({
    url: String,
    filename: String
});

//virtual property as we need not store this in our database
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');    //this w-200 is from image-transformations from cloudinary api (it means max width 200)
});

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    //GEO-JSON --this format is exactly from docs as this is the type the .geometry returns using geocoding
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

CampgroundSchema.post('findOneAndDelete', async function (doc) { //the thing deleted will be passed in this function --here we name it doc
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);









