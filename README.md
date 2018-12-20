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
DROP DATABASE my_database;
CREATE DATABASE my_database;
\c my_database;

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

###Configure your .env
- Set your DATABASE_URL
  - For Mac : ```DATABASE_URL=postgres://localhost:5432/movies_db```
  - For Windows: ```DATABASE_URL=postgres://<username>:<password>@localhost:5432/movies_db```
- Set your API KEY
  - ```MOVIE_API_KEY=<your-apikey-here>```

## Architecture
<!-- Provide a detailed description of the application design. What technologies (languages, libraries, etc) you're using, and any other relevant design information. -->


## Change Log
<!-- Use this area to document the iterative changes made to your application as each feature is successfully implemented. Use time stamps. Here's an examples:

01-01-2001 4:59pm - Application now has a fully-functional express server, with a GET route for the location resource. -->


## Credits and Collaborations
<!-- Give credit (and a link) to other people or resources that helped you build this application. -->
