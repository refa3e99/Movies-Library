'use strict'

const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
require("dotenv").config();
const axios = require("axios").default;
const moviesData = require("./Movie Data/data.json");
const bodyParser = require('body-parser');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let url = process.env.DATABASE_URL;
const { Client } = require('pg');
const client = new Client(url);


//API KEY
let apiKey = process.env.API_KEY;

//Routes
app.get("/",homePage);
app.get("/favorite",favoritePage);
app.get("/trending",trendingHandler);
app.get("/search", searchMovieHandler);
app.get("/discover",discoverHandler);
app.get("/genres",genresHandler);
//-----------
//CRUD
app.post('/addMovie',postHandler);
app.get('/getMovies',getHandler);
app.put('/updateMovie/:MovieId', handleUpdateMovie);
app.delete('/deleteMovie/:MovieId',handleDeleteMovie);
app.get('/getMovies/:MovieId',handleGetMovie);





function handleGetMovie(req,res) {
    let id = req.params.MovieId;
    let sql = `SELECT * FROM movies WHERE id =${id}`;
    client.query(sql).then(result => {
        console.log(result.rows[0]);
        res.json(result.rows[0]);
    })
    .catch()
}
  

function handleDeleteMovie(req,res) {
    let id = req.params.MovieId;
    let sql = `DELETE FROM movies WHERE id =${id} RETURNING *`;
    client.query(sql).then(result => {
        console.log(result.rows[0]);
        res.status(204).json([]);
    })
    .catch(err => {
        console.log(err);
    })
}



function handleUpdateMovie(req,res){
    let id = req.params.MovieId;
    let {title,category,overview,age,comment} = req.body;
    let sql = `UPDATE movies SET title =$1 , category =$2 , overview =$3 , age =$4 , comment =$5  WHERE id = ${id} RETURNING *`;
    let values = [title,category,overview,age,comment];
    client.query(sql, values).then(result => {
        console.log(result.rows[0]);
        res.send(result.rows[0]);
    })
    .catch()
}



function postHandler(req , res){
    console.log(req.body);

    let {title,category,overview,age,comment} = req.body;


    let sql = `INSERT INTO movies (title, category, overview, age, comment) VALUES ($1,$2,$3,$4,$5) RETURNING *`;
    let values = [title, category, overview, age ,comment];
    client.query(sql,values).then(result => {
        console.log(result.rows[0]);
        return res.status(201).json(result.rows);
    })
    .catch()
}

function getHandler(req , res){
    let sql = `SELECT * FROM movies ;` ;
    client.query(sql).then((result)=>{
        console.log(result);
        res.json(result.rows);
    }).catch()
}


//genres route function
function genresHandler(req , res) {
    let url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`
    axios.get(url)
    .then(result => {
        console.log(result.data)
        res.json(result.data)
    })
    .catch(error => {
        console.log(error);
        res.send("error in getting data from the API")
    })
}


//discover route function
function discoverHandler(req , res) {
    let url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`
    axios.get(url)
    .then(result => {
        console.log(result.data.results)
        res.json(result.data.results)
    })
    .catch(error => {
        console.log(error);
        res.send("error in getting data from the API")
    })
}

//Search route function
function searchMovieHandler(req , res){
    //console.log(req.query);
    //res.send("searching")

    let movieName = req.query.query;
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${movieName}&page=1&include_adult=false`
    axios.get(url)
    .then(result => {
        console.log(result.data.results)
        res.json(result.data.results)
    })
    .catch(error => {
        console.log(error);
        res.send("error in getting data from the API")
    });
}

//favourite route function
function favoritePage(req , res) {
    res.send("Welcome to Favorite Page");
}

//trending route function
function trendingHandler(req,res){
    let url = `https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}`
    axios.get(url)
    .then(result => {
       // console.log(result.data)
       // res.send("api gave me data")

       let movies = result.data.results.map((movie) => {
           return new Movie(
               movie.id,
               movie.title,
               movie.release_date,
               movie.poster_path,
               movie.overview
            );
       });
       res.json(movies);
    }
    )

    .catch(error => {
        console.log(error);
        res.send("error in getting data from the API")
    })
}

//Home page route function
function homePage(req , res){
    let movieInfo = [];

    moviesData.data.forEach(element => {
        let newMovie = new Movie(
            element.title,
            element.poster_path,
            element.overview);

            movieInfo.push(newMovie);
    })

    console.log(movieInfo);
    res.json(movieInfo);

}

//constructor
function Movie(id , title , release_date , poster_path , overview){
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview
}

//Error 500 handler
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send({
        "status": 500,
        "responseText": "Sorry, something went wrong"
        })
  })

//Error 404 handler
app.use((req, res, next) => {
    res.status(404).send("page not found")
  })

client.connect().then( () => {

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
      })

})



