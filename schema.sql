DROP TABLE IF EXISTS movies;

CREATE TABLE IF NOT EXISTS movies (
    id SERIAL PRIMARY KEY,
    title varchar(255),
    category varchar(255),
    overview varchar(255),
    age varchar(255)
)