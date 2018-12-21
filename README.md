# Star-Flix

**Author**: Clarice Costello, Michael Kelly, Nate Tibbals, Jason Few
**Version**: 1.0.0

## Overview
Star-Flix is a movie database that allows users to search for movies with use of the TMDB API, save those movies, and then edit Movie Overviews, Ratings and Popularity, as well as leave reviews on saved movies. Additionally, Star-Flix renders popular movies on the home page to encourage discovery of new movies.

The information rendered from the TMDB API is saved to a Database containing two tables, a movies table to store movie information, and a reviews table to hold the reviews. The two tables are linked together by each movie's id. 

Potential Operations
- Upon page load, a search bar and popular movie posters from TMDB API render on the page.
- On click of a movie poster, details about the movie appear, along with a save button option.
- If the user clicks 'save movie', they will go to a list of saved movies. Their saved movie will be at the bottom.
- If the user runs a search, a list of movies related to their search will populate, along with details about each movie and a save movie option.
- Upon clicking save movie, the user will be taken to a list of saved movies.
- The list of saved movies includes a details button. From the details button the user has several options.
  + Add A Review: Add a review to the movie
  + Delete Movie: Removes the movie from the database, and takes the user back to the saved movies page.
  + Edit Movie: Changes the description, rating, and popularity in the database, and takes the user back to the saved movies page.


<!-- Provide a high level overview of what this application is and why you are building it, beyond the fact that it's an assignment for this class. (i.e. What's your problem domain?) -->

## Getting Started
<!-- What are the steps that a user must take in order to build this app on their own machine and get it running? -->
### Equipment and Software
+ GitHub Account
+ Heroku
+ Postgres
+ Node.JS

### Initial Set Up
- Create a repository. Clone it to your device.
- Create a server.js file
``` touch  server.js ```
- Initiate NPM 
``` npm init -y ```
- Install the necessary packages
  + ``` npm i express cors pg superagent dotenv method-override ejs nodemon ```
    + express
    + cors
    + pg
    + superagent
    + dotenv
    + method-override
    + ejs
    + you may also want to install nodemon
- create a .gitignore
``` touch .gitignore ```
You want to include .env and node in your .gitignore

### Create Your Database
- create a SQL database
``` createdb my_database ```
Note: If you are using windows, you must run the command ```pgstart``` before creating your database.
- Create a schema.sql
``` touch schema.sql ```
- Insert the following code into your schema file
```SQL
DROP DATABASE <my_database_name>;
CREATE DATABASE <my_database_name>;
\c <my_database_name>;

DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS movies;


CREATE TABLE movies (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  popularity VARCHAR(255),
  overview TEXT,
  released_on VARCHAR(255),
  image_url VARCHAR(255),
  stars BIGINT
);

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255),
  review TEXT,
  created_at BIGINT,
  movie_id INTEGER NOT NULL,
  FOREIGN KEY (movie_id) REFERENCES movies (id)
);
```
### Get your API Key
This app uses the TMDB API. To get your API key, make an account in TMDB, got to settings, and get your API key. You will need it later.

### Configure your .env
- Set your DATABASE_URL
  - For Mac : ```DATABASE_URL=postgres://localhost:5432/my_database_name>```
  - For Windows: ```DATABASE_URL=postgres://<username>:<password>@localhost:5432/<my_database_name>```
- Set your API KEY
  - ```MOVIE_API_KEY=<your-apikey-here>```

### Get Started Coding!

## Architecture
<!-- Provide a detailed description of the application design. What technologies (languages, libraries, etc) you're using, and any other relevant design information. -->
### Languages
- JavaScript
- HTML
- CSS
- SQL

### Libraries
- JQuery
- EJS

### Packages
- ejs
- express
- cors
- superagent
- pg
- dotenv
- method-override
- nodemon (optional)
### API
- theMovieDB https://www.themoviedb.org/documentation/api


### Scaffold
```sh
star_flix (repository)
├──public
│  ├── scripts
│  │   ├── app.js
│  │   └── group.js
│  └── styles
│      ├── fonts
│      ├── images
│      ├── layout
│      │   ├──footer.css
│      │   └──header.css
│      ├── modules
│      │   ├──animation.css
│      │   ├──home-content.css
│      │   ├──results-pages.css
│      │   ├──review-page.css
│      │   ├──saved-movies.css
│      │   ├──search.css
│      │   └──sort-page.css
│      ├── base.css
│      ├── group.css
│      └── reset.css
├──views
│  ├── layout
│  │   ├── group.ejs
│  │   ├── home.ejs
│  │   ├── search.ejs
│  │   ├── sort-components.ejs
│  │   ├── footer.ejs
│  │   ├── head.ejs
│  │   └── header.ejs
│  └── pages
│      ├── movies
│      │   ├── detail.ejs
│      │   └── saved_movies.ejs
│      ├── searches
│      │   ├── new.ejs
│      │   ├── sort.ejs
│      │   └── update.ejs
│      ├── error.ejs
│      └── index.ejs
├── .env
├── .eslintrc.json
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
├── schema.sql
└── server.js
```

## Change Log
+ 12-14-2018 - Basic Scaffold and Database has been set up
+ 12-17-2018 10:00am - Application now has a fully functional express server, linked to the tmdb API.
+ 12-17-2018 2:00pm - Application can now save movies from the API to the database, and render the saved movies. Popular Movies now appear on index.ejs
+ 12-17-2018 5:00pm - Basic CSS is in place. 
+ 12-18-2018 10:00am - Application now has a view details page that takes details from database and renders them on page. The ability to add a review has been added. 
+ 12-18-2018 2:00am - Application will now sort popular movies based on user selections.
+ 12-19-2018 3:00pm - Application now has ability to take in multiple reviews for each movie. 
+ 12-20-2018 11:00am - Application now has the ability to delete movies and all associated reviews. 



## Credits and Collaborations
#### Help From: 
- James Salamonsen 
- Madeline Peters


