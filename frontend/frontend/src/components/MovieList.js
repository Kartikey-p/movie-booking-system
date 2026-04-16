import { useEffect, useState } from "react";

function MovieList({ onSelectMovie }) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/movies")
      .then(res => res.json())
      .then(data => setMovies(data));
  }, []);

  return (
    <div>
      <h2>Available Movies</h2>

      {movies.map(movie => (
        <div key={movie.id} style={{ border: "1px solid white", margin: "10px", padding: "10px" }}>
          <h3>{movie.title}</h3>
          <p>{movie.genre}</p>
          <button onClick={() => onSelectMovie(movie)}>
            Book Now
          </button>
        </div>
      ))}
    </div>
  );
}

export default MovieList;