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
  FOREIGN KEY (movie_id) REFERENCES movies (id) ON DELETE CASCADE
);

