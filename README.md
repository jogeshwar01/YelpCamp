<div align="right">
  <img src="https://img.shields.io/badge/Completion-100%25-blue.svg" />
  <a href="https://github.com/Hsins/udemy_Yelp-Camp/blob/master/LICENSE" alt="License">
    <img src="https://img.shields.io/github/license/Hsins/udemy_Yelp-Camp.svg" />
  </a>
</div>

<div>
  <h1>🏕️ YelpCamp 🌲</h1>
</div>

<div align="center">
  <h2>- Development Process -</h2>
</div>

YelpCamp is a website where users can create and review campgrounds. In order to review or create a campground, you must have an account. This project was part of Colt Steele's web dev course on udemy.  

This project was created using Node.js, Express, MongoDB, and Bootstrap. Passport.js was used to handle authentication.  

## Features
* Users can create, edit, and remove campgrounds
* Users can review campgrounds once, and edit or remove their review
* User profiles include more information on the user (full name, email, phone, join date), their campgrounds, and the option to edit their profile or delete their account
* Search campground by name or location
* Sort campgrounds by highest rating, most reviewed, lowest price, or highest price

## Run it locally
1. Install [mongodb](https://www.mongodb.com/)
2. Create a cloudinary account to get an API key and secret code

```
git clone https://github.com/jogeshwar01/YelpCamp.git
cd yelpcamp
npm install
```

Create a .env file (or just export manually in the terminal) in the root of the project and add the following:  

```
DATABASEURL='<url>'
API_KEY=''<key>
API_SECRET='<secret>'
```

Run ```mongod``` in another terminal and ```node app.js``` in the terminal with the project.  

Then go to [localhost:3000](http://localhost:3000/).
