DROP DATABASE my_movies;
CREATE DATABASE my_movies;
\c my_movies;

DROP TABLE IF EXISTS movies;



CREATE TABLE movies (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  popularity VARCHAR(255),
  released_on VARCHAR(255),
  image_url VARCHAR(255),
  created_at BIGINT,
  location_id INTEGER NOT NULL,
  FOREIGN KEY (location_id) REFERENCES locations (id)
);