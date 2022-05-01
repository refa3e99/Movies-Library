'use strict'

const express = require('express')
const app = express()
const port = 3000

const moviesData = require("./Movie Data/data.json")

app.get("/",homePage);

app.get("/favorite",favoritePage);

function favoritePage(req , res) {
    res.send("Welcome to Favorite Page");
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
function Movie(title , poster_path , overview){
    this.title = title;
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