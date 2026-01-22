import { useState } from "react";
import movies from "./data/movies.json";

function App() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const extractGenres = (movie) => {
    try {
      const parsed = JSON.parse(movie.genres);
      return parsed.map(g => g.name.toLowerCase());
    } catch {
      return [];
    }
  };

  const recommendMovies = () => {
    if (!input.trim()) return;

    setLoading(true);
    setResults([]);

    setTimeout(() => {
      const keyword = input.toLowerCase();

      const selectedMovie = movies.find(m =>
        m.title.toLowerCase().includes(keyword)
      );

      let recommendations = [];

      if (selectedMovie) {
        const baseGenres = extractGenres(selectedMovie);

        recommendations = movies.filter(m => {
          if (m.id === selectedMovie.id) return false;
          const genres = extractGenres(m);
          return genres.some(g => baseGenres.includes(g));
        });
      } else {
        recommendations = movies.filter(m => {
          const genres = extractGenres(m);
          return genres.some(g => g.includes(keyword));
        });
      }

      if (recommendations.length === 0) {
        recommendations = movies.slice(0, 5);
      }

      setResults(recommendations.slice(0, 5));
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="container">
      <h1>🎬 Movie Recommendation System</h1>

      <input
        placeholder="Search movie or genre (e.g. Avatar, Documentary)"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button onClick={recommendMovies} disabled={loading}>
        {loading ? "Analyzing preferences..." : "Recommend"}
      </button>

      {loading && (
        <p className="loading-text">
          🤖 AI is finding similar movies...
        </p>
      )}

      <ul>
        {!loading &&
          results.map((movie, index) => (
            <li key={index}>{movie.title}</li>
          ))}
      </ul>

      <p className="footer-text">
        Recommendations generated using content-based filtering
      </p>
    </div>
  );
}

export default App;