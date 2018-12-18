'use strict';

const express = require('express');
const ejs = require('ejs');
const superagent = require('superagent');
const cors = require('cors');
const pg = require('pg');
const methodOverride = require('method-override');
const app = express();

app.use(cors());

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.use(
  methodOverride((request, response) => {
    if (
      request.body &&
      typeof request.body === 'object' &&
      '_method' in request.body
    ) {
      let method = request.body._method;
      delete request.body._method;
      return method;
    }
  })
);

require('dotenv').config();

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', error => console.error(error));
client.connect();

app.get('/new', (req, res) => {
  res.render('../views/pages/searches/new');
});

app.get('/about', (req, res) => {
  res.render('../views/pages/about_us/aboutus');
});

app.set('view engine', 'ejs');
app.post('/show', getResults);
//app.get('/movies', getResults);
app.post('/mymovies', saveResults);
app.get('/mymovies', getSavedMovies);

app.post('/details/:id', saveReviews);
app.get('/details/:id', getDetails);


app.post('/delete/:id', deleteMovie);



//generate popular movies
app.get('/', getPopularMovies);

function Movie(data) {
  this.title = data.title;
  this.popularity = data.popularity;
  this.overview = data.overview;
  if( data.released_on){
    this.released_on = data.released_on;
  } else {
    this.released_on = 'N/A';
  }
  this.image_url =
    'https://image.tmdb.org/t/p/w370_and_h556_bestv2/' + data.poster_path;
  this.created_at = Date.now();
}

let fetchData = (input =>{
  console.log('fetch is running');
  let query = input.movieSearch
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${query}`;

  return superagent.get(url).then(result => {
    const movieSum = result.body.results.map(data => {
      const summary = new Movie(data);
      return summary;
    });
    return movieSum;
  });
});

function getResults(request, response) {
  console.log('my request body:', request.body);
  let input = request.body;
  fetchData(input)
    .then(result => {
      console.log(result);
      response.render('pages/searches/show', {renderedMovies: result});
    });

}

//Functions to generate popular movies for home page
//get function
function getPopularMovies(request, response){
  console.log('my request body:', request.body);
  let input = request.body;
  fetchPopularMovies(input)
    .then(result => {
      response.render('../views/pages/index', {popularMovies: result,});
    });
}
//fetch function
let fetchPopularMovies = (input => {
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.MOVIE_API_KEY}`;

  return superagent.get(url).then(result => {
    const popularMovies = result.body.results.map(data => {
      const summary = new PopularMovies(data);
      return summary;
    });
    return popularMovies;
  });
});
//constructor function
function PopularMovies(data) {
  this.title = data.title;
  this.popularity = data.popularity;
  this.overview = data.overview;
  this.released_on = data.release_date;
  this.image_url =
    'https://image.tmdb.org/t/p/w370_and_h556_bestv2/' + data.poster_path;
  this.description = data.overview;
  this.stars = Math.round(data.vote_average / 2);
}


//save movie function
function saveResults(req, res) {
  let {title, popularity, overview, released_on, image_url, created_at} = req.body;
  let SQL = `INSERT INTO movies(title, popularity, overview, released_on, image_url, created_at) VALUES($1,$2,$3,$4,$5,$6) RETURNING id;`;
  let values = [title, popularity, overview, released_on, image_url, created_at];
  client.query(SQL, values)
    .then(res.redirect(`/mymovies`))
    .catch(err => errorHandler(err, res));
}

//Get saved movies
function getSavedMovies(request, response){
  let SQL = 'SELECT * FROM movies;';

  return client.query(SQL)
    .then( results => {
      response.render('../views/pages/movies/saved_movies', { savedMovies: results.rows })
    })
    .catch(err => console.error(err));
}

function saveReviews(request, response) {
  console.log('save reviews is firing');
  let {username, review, created_at, movie_id} = request.body;
  let SQL = `INSERT INTO reviews (username, review, created_at, movie_id) VALUES($1,$2,$3,$4) RETURNING id;`;
  let values = [username, review, created_at, movie_id];
  client.query(SQL, values)
    .then(response.redirect(`/details/${movie_id}`))
    .catch(err => errorHandler(err, response));
}


function getDetails(request, response) {
  console.log('running getDetails');
  let SQL = 'SELECT * FROM movies INNER JOIN reviews ON movies.id = movie_id WHERE movies.id=$1;';
  // let SQL = 'SELECT * FROM movies WHERE id=$1;';
  let values = [request.params.id];
  console.log(client.query(SQL, values));
  return client.query(SQL, values)
    .then(result => {

      response.render('../views/pages/movies/details', {movie: result.rows});
    });
}


function deleteMovie(request, response){
  console.log('delete running');
  let SQL =`DELETE FROM movies WHERE id = $1;`;
  let values = [request.params.id];
  client.query(SQL, values)
    .then(response.redirect('/mymovies'));
};


function errorHandler(err, res) {
  res.redirect('https://http.cat/404');
}


app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});

