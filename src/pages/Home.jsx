import MovieCard from "../components/MovieCard";
import { useState, useEffect } from "react";
import { getPopularMovies, searchMovies } from "../services/api"; 
import "../css/Home.css";

function Home() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);              
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setIsSearching(true);  
    try {
      const searchResults = await searchMovies(searchQuery);
      const safeResults = searchResults.filter(movie => !movie.adult);
      setMovies(safeResults);
      setError(null);
    } catch (err) {
      console.log(err);
      setError("Failed to search movies...");
    } finally {
      setLoading(false);
    }
    const searchResults = await searchMovies(searchQuery);
console.log(searchResults);

  };

  useEffect(() => {
    if (isSearching) return; 

    const loadMovies = async () => {
      setLoading(true);
      try {
        const newMovies = await getPopularMovies(page);
        const safeMovies = newMovies.filter(movie => !movie.adult);
        if (!safeMovies || safeMovies.length === 0) {
          setError("No more movies found.");
          return;
        }
        setMovies(prev => {
          const existingIds = new Set(prev.map(m => m.id));
          const uniqueNew = safeMovies.filter(m => !existingIds.has(m.id));
          return [...prev, ...uniqueNew];
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load movies...");
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [page, isSearching]);

  useEffect(() => {
    const handleScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
      if (nearBottom && !loading && !isSearching) {
        setPage(prev => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, isSearching]);

  return (
    <div className="home">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for movies..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-button">Search</button>
        {isSearching && (
          <button
            type="button"
            className="clear-search-button"
            onClick={() => {
              setSearchQuery("");
              setIsSearching(false);
              setPage(1);
              setMovies([]);
            }}
          >
            Clear
          </button>
        )}
      </form>

      <h2 className="section-heading">
        {isSearching ? `Search Results for "${searchQuery}"` : "Popular Movies"}
      </h2>

      {error && <div className="error-message">{error}</div>}

      {isSearching && !loading && movies.length === 0 ? (
        <div className="no-results-message">No movies found for "{searchQuery}"</div>
      ) : (
        <div className="movies-grid">
          {movies.map((movie) => (
            <MovieCard movie={movie} key={movie.id} />
          ))}
        </div>
      )}

      {loading && <div className="loading">Loading...</div>}
    </div>
  );
}

export default Home;
