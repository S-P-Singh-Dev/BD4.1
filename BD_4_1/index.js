let express = require("express");
let cors = require("cors");
let sqlite3 = require("sqlite3").verbose();
let { open } = require("sqlite");

const app = express();
app.use(cors());
app.use(express.json());

let db;

(async () => {
  db = await open({
    filename: "./BD_4_1/database.sqlite",
    driver: sqlite3.Database,
  });
})();

async function fetchAllMovies() {
  let query = "SELECT * FROM movies";
  let result = await db.all(query, []);
  return { movies: result };
}

async function fetchMoviesByGenre(genre) {
  let query = "SELECT * FROM movies WHERE genre = ?";
  let result = await db.all(query, [genre]);
  return { movies: result };
}

async function fetchMoviesByID(id) {
  let query = "SELECT * FROM movies WHERE id = ?";
  let result = await db.get(query, [id]);
  return { movies: result };
}

async function fetchMoviesByReleaseYear(releaseYear) {
  let query = "SELECT * FROM movies WHERE release_year = ?";
  let result = await db.get(query, [releaseYear]);
  return { movies: result };
}

app.get("/movies", async (req, res) => {
  let results = await fetchAllMovies();
  res.status(200).json(results);
});

app.get("/movies/genre/:genre", async (req, res) => {
  try {
    let genre = req.params.genre;
    let result = await fetchMoviesByGenre(genre);

    if (result.movies.length === 0) {
      res.status(404).json({ message: "No movies found" });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/movies/details/:id", async (req, res) => {
  let id = req.params.id;
  let result = await fetchMoviesByID(id);
  res.status(200).json(result);
});

app.get("/movies/release-year/:year", async (req, res) => {
  let releaseYear = req.params.year;
  let result = await fetchMoviesByReleaseYear(releaseYear);
  res.status(200).json(result);
});

app.listen(3000, () => {
  console.log("Express server initialized");
});
