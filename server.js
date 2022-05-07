'use strict'

const express = require('express')
const app = express()
const port = 3000
const axios = require("axios").default;

const moviesData = require("./Movie Data/data.json")

app.get("/",homePage);

app.get("/favorite",favoritePage);

app.get("/trending",trendingHandler);

app.get("/search", searchMovieHandler);

function searchMovieHandler(req , res){
   // console.log(req.query);
    //res.send("searching")

    let movieName = req.query.name;
    let url = "https://api.themoviedb.org/3/search/movie?api_key=668baa4bb128a32b82fe0c15b21dd699&language=en-US&query=The&page=2"
    axios.get(url)
    .then(result => {
        console.log(page.results)
    })
    .catch()
}

function favoritePage(req , res) {
    res.send("Welcome to Favorite Page");
}

function trendingHandler(req,res){
    let url = "https://api.themoviedb.org/3/trending/all/week?api_key=37ddc7081e348bf246a42f3be2b3dfd0&language=en-US"
    axios.get(url)
    .then(result => {
        console.log(result.data)
        res.send("api gave me data")

       let movies = result.page.results.map((movie) => {
           return new Movie(
               movie.id,
               movie.title,
               movie.release_date,
               movie.poster_path,
               movie.overview
            );
       })
       res.json(movies);  
    }
        
    )
    .catch(error => {
        console.log(error);
        res.send("error in getting data from the API")
    })
}

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

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send({
        "status": 500,
        "responseText": "Sorry, something went wrong"
        })
  })

app.use((req, res, next) => {
    res.status(404).send("page not found")
  })


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


