const express = require("express");
const exphbs = require("express-handlebars");
const axios = require("axios");

const app = express();
const PORT = 3000;
const API_KEY = "1d3ef5e4";

app.engine("hbs", exphbs.engine({ extname: "hbs" }));
app.set("view engine", "hbs");
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/search", async (req, res) => {
    const query = req.query.q;
    //console.log(query);
    if (!query) {
        return res.render("home", { error: "Please enter a movie title." });
    }

    try {
        const response = await axios.get(`https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`);
        const data = response.data;

        if (data.Response === "True") {
            res.render("home", { movies: data.Search });
        } else {
            res.render("home", { error: "No results found." });
        }
    } catch (error) {
        res.render("home", { error: "Error fetching data." });
    }
});

app.get("/movie/:id", async (req, res) => {
    const movieID = req.params.id;
    //console.log(movieID)

    try {
        const response = await axios.get(`https://www.omdbapi.com/?i=${movieID}&apikey=${API_KEY}`);
        //console.log(response.data);
        const movie = response.data;

        if (movie.Response === "True") {
            res.render("movie", { movie });
        } else {
            res.render("movie", { error: "Movie not found." });
        }
    } catch (error) {
        res.render("movie", { error: "Error fetching movie details." });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;