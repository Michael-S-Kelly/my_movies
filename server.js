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
app.use(express.static('./public'));

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

app.set('view engine', 'ejs');
app.post('/show', getResults);
//app.get('/movies', getResults);
app.post('/', saveResults);


//generate popular movies
app.get('/', getPopularMovies);

function Movie(data) {
  this.title = data.title;
  this.popularity = data.popularity;
  this.released_on = data.released_on;
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
      response.render('/', {popularMovies: result,});
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
  this.released_on = data.release_date;
  this.image_url =
    'https://image.tmdb.org/t/p/w370_and_h556_bestv2/' + data.poster_path;
  this.description = data.overview;
}



function saveResults(req, res) {
  let {title, popularity, released_on, image_url, created_at} = req.body;
  let SQL = `INSERT INTO my_movies(title, popularity, released_on, image_url, created_at) RETURNING id;`;
  let values = [title, popularity, released_on, image_url, created_at];
  client.query(SQL, values)
    .then(res.redirect(`/`))
    .catch(err => errorHandler(err, res));
}

function errorHandler(err, res) {
  res.redirect('https://http.cat/404');
}

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
