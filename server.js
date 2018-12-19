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
  methodOverride((req, res) => {
    if (
      req.body &&
      typeof req.body === 'object' &&
      '_method' in req.body
    ) {
      let method = req.body._method;
      delete req.body._method;
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
app.post('/sort', getSortedMovies);
app.get('/star_trek', getResultsTrek);
app.put('/details/:id', updateMovie);

function Movie(data) {
  this.title = data.title;
  this.popularity = data.popularity;
  this.overview = data.overview;
  if (data.released_on) {
    this.released_on = data.released_on;
  } else {
    this.released_on = 'N/A';
  }
  this.image_url =
    'https://image.tmdb.org/t/p/w370_and_h556_bestv2/' + data.poster_path;
  this.created_at = Date.now();
}

let fetchData = input => {
  console.log('fetch is running');
  let query = input.movieSearch;
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${
    process.env.MOVIE_API_KEY
  }&query=${query}`;

  return superagent.get(url).then(result => {
    const movieSum = result.body.results.map(data => {
      const summary = new Movie(data);
      return summary;
    });
    return movieSum;
  });
};


function getResults(req, res) {
  console.log('my req body:', req.body);
  let input = req.body;
  fetchData(input)
    .then(result => {
      console.log(result);
      res.render('pages/searches/show', {renderedMovies: result});
    })
    .catch(err => errorHandler(err, res));
}

//Functions to generate popular movies for home page
//get function

function getPopularMovies(req, res){
  console.log('my req body:', req.body);
  let input = req.body;
  fetchPopularMovies(input)
    .then(result => {
      res.render('../views/pages/index', {popularMovies: result,});
    })
    // .catch(err => errorHandler(err, res));
}

//fetch function
let fetchPopularMovies = input => {
  let query = input.selectSort;
  console.log(query);
  var url = `https://api.themoviedb.org/3/discover/movie?api_key=${
    process.env.MOVIE_API_KEY
  }`;

  return superagent.get(url).then(result => {
    const popularMovies = result.body.results.map(data => {
      const summary = new PopularMovies(data);
      return summary;
    });
    return popularMovies;
  });

};

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
  let {
    title,
    popularity,
    overview,
    released_on,
    image_url,
    created_at
  } = req.body;
  let SQL = `INSERT INTO movies(title, popularity, overview, released_on, image_url, created_at) VALUES($1,$2,$3,$4,$5,$6) RETURNING id;`;
  let values = [
    title,
    popularity,
    overview,
    released_on,
    image_url,
    created_at
  ];
  client
    .query(SQL, values)
    .then(res.redirect(`/mymovies`))
    .catch(err => errorHandler(err, res));
}

//Get saved movies
function getSavedMovies(req, res){
  let SQL = 'SELECT * FROM movies;';

  return client.query(SQL)
    .then( results => {
      res.render('../views/pages/movies/saved_movies', { savedMovies: results.rows })
    })
    .catch(err => console.error(err));
}

function saveReviews(request, response) {
  console.log('save reviews is firing');

  let { username, review, created_at, movie_id } = request.body;
  let SQL = `INSERT INTO reviews (username, review, created_at, movie_id) VALUES($1,$2,$3,$4) RETURNING id;`;
  let values = [username, review, created_at, movie_id];
  client
    .query(SQL, values)
    .then(response.redirect('/mymovies'))
    .catch(err => errorHandler(err, response));
}

function getDetails(request, response) {
  console.log('running getDetails');
  let SQLrev ='SELECT * FROM movies INNER JOIN reviews ON movies.id = movie_id WHERE movies.id=$1;';
  let SQL = 'SELECT * FROM movies WHERE id=$1;';
  let values = [request.params.id];


  client.query(SQLrev, values).then(result => {
    if (result.rows.length > 0) {
      response.render('../views/pages/movies/details', { movie: result.rows[0] });
    }
    else {
      client.query(SQL, values).then(result => {
        response.render('../views/pages/movies/details', { movie: result.rows[0] });
      });
    }
  });
}

function deleteMovie(request, response) {
  console.log('delete running');
  //let SQL = 'DELETE FROM movies, reviews INNER JOIN reviews ON movies.id = movie_id WHERE movies.id=$1;';
  let SQL2 = `DELETE FROM reviews WHERE id = $1;`;

  let value = [request.params.id];
  
  client.query(SQL2, value).then(function () {
    let SQL = `DELETE FROM movies WHERE id = $1;`;
    let values = [request.params.id];
    client.query(SQL, values).then(response.redirect('/mymovies'));
  })
}


function errorHandler(err, res) {
  res.redirect('https://http.cat/404');
}

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});

function SortedMovies(data) {
  this.title = data.title;
  this.popularity = data.popularity;
  this.overview = data.overview;
  this.released_on = data.release_date;
  this.image_url =
    'https://image.tmdb.org/t/p/w370_and_h556_bestv2/' + data.poster_path;
  this.description = data.overview;
}

let fetchSortedMovies = input => {
  let query = input.search;

  var url = '';

  if (query === 'Rating') {
    var url = `https://api.themoviedb.org/3/discover/movie?api_key=${
      process.env.MOVIE_API_KEY
    }&certification_country=US&certification=R&sort_by=vote_average.desc`;
  }
  if (query === 'Popular With Kids') {
    var url = `https://api.themoviedb.org/3/discover/movie?api_key=${
      process.env.MOVIE_API_KEY
    }&certification_country=US&certification.lte=G&sort_by=popularity.desc`;
  } else if (query === 'Popular This Year') {
    var url = `https://api.themoviedb.org/3/discover/movie?api_key=${
      process.env.MOVIE_API_KEY
    }&with_genres=18&primary_release_year=2018`;
  }

  return superagent.get(url).then(result => {
    const sortedMovies = result.body.results.map(data => {
      const summary = new SortedMovies(data);
      return summary;
    });
    return sortedMovies;
  });
};

function getSortedMovies(request, response) {
  console.log('my request body:', request.body);
  let input = request.body;
  fetchSortedMovies(input).then(result => {
    response.render('../views/pages/searches/sort', { sortedMovies: result });
  });
}

function StarTrek(data) {
  this.title = data.title;
  this.popularity = data.popularity;
  this.overview = data.overview;
  if (data.released_on) {
    this.released_on = data.released_on;
  } else {
    this.released_on = 'N/A';
  }
  this.image_url =
    'https://image.tmdb.org/t/p/w370_and_h556_bestv2/' + data.poster_path;
  this.created_at = Date.now();
}

function fetchTrek() {
  console.log('fetch is running');
  let query = 'Star Trek';
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${
    process.env.MOVIE_API_KEY
  }&query=${query}`;

  return superagent.get(url).then(result => {
    const trekSum = result.body.results.map(data => {
      const summary = new StarTrek(data);
      return summary;
    });
    return trekSum;
  });
}

function getResultsTrek(request, response) {
  console.log('my request body:', request.body);
  let input = request.body;
  fetchTrek(input).then(result => {
    console.log(result);
    response.render('pages/searches/star_trek', { trekMovies: result });
  });
}

function updateMovie(request, response){
  let {title, popularity, overview, released_on, image_url, created_at} = request.body;
  let SQL =`UPDATE movies SET title = $1, popularity = $2, overview = $3, released_on = $4, image_url = $5, created_at = $6 WHERE id = $7;`;
  let values = [title, popularity, overview, released_on, image_url, created_at];
  client.query(SQL, values)
    .then(response.redirect(`/details/:id`))
    .catch(err => console.error(err));

};
