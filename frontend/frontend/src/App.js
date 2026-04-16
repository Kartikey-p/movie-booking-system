import { useState } from "react";
import MovieList from "./components/MovieList";
import SeatBooking from "./components/SeatBooking";

function App() {
  const [selectedMovie, setSelectedMovie] = useState(null);

  return (
    <div
      style={{
        padding: "20px",
        background: "#111",
        color: "white",
        minHeight: "100vh",
      }}
    >
      <h1>🎬 Movie Booking App</h1>

      {!selectedMovie ? (
        <MovieList onSelectMovie={setSelectedMovie} />
      ) : (
        <SeatBooking
          movie={selectedMovie}
          goBack={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}

export default App;