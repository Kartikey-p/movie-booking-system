const router = require("express").Router();

let movies = [];

// ADD MOVIE
router.post("/add", (req, res) => {
    const { title, genre } = req.body;

    const movie = {
        id: movies.length + 1,
        title,
        genre
    };

    movies.push(movie);

    res.json(movie);
});

// GET ALL MOVIES
router.get("/", (req, res) => {
    res.json(movies);
});

module.exports = router;