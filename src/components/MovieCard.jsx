import "../css/MovieCard.css";
import { useMovieContext } from "../contexts/MovieContext";
import { addFavorite, removeFavorite } from "../services/favouriteService";
import { addToWatchlist, removeFromWatchlist } from "../services/watchlistservice";
import { auth, db } from "../services/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";

function MovieCard({ movie }) {
  const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();
  const favorite = isFavorite(movie.id);
  const [user] = useAuthState(auth);
  const [inWatchlist, setInWatchlist] = useState(false);
  const { genreMap } = useMovieContext();

  useEffect(() => {
    if (!user) return;

    const checkWatchlist = async () => {
      const ref = doc(db, "users", user.uid, "watchlist", movie.id.toString());
      const docSnap = await getDoc(ref);
      setInWatchlist(docSnap.exists());
    };

    checkWatchlist();
  }, [user, movie.id]);

  const handleWatchlistClick = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please log in to use the watchlist.");

    if (inWatchlist) {
      await removeFromWatchlist(user.uid, movie.id);
      setInWatchlist(false);
    } else {
      await addToWatchlist(user.uid, movie);
      setInWatchlist(true);
    }
  };

  const renderStars = (rating = 0) => {
  const stars = [];
  const starRating = Number(rating) / 2;

  for (let i = 0; i < 5; i++) {
    if (i + 1 <= Math.floor(starRating)) {
      stars.push(<FaStar key={`star-${i}`} className="star" />);
    } else if (i + 0.5 <= starRating) {
      stars.push(<FaStarHalfAlt key={`half-${i}`} className="star" />);
    } else {
      stars.push(<FaRegStar key={`empty-${i}`} className="star" />);
    }
  }

  return stars;
};


  const onFavoriteClick = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please log in to manage favorites.");

    const movieData = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
    };

    try {
      if (favorite) {
        await removeFavorite(user.uid, movieData); 
        removeFromFavorites(movie.id);             
      } else {
        await addFavorite(user.uid, movieData);
        addToFavorites(movie);
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  return (
    <div className="movie-card">
      <Link to={`/movie/${movie.id}`}>
        <div className="movie-poster">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
          />
          <div className="movie-overlay">
            <button
              className={`favorite-btn ${favorite ? "active" : ""}`}
              onClick={onFavoriteClick}
              title={favorite ? "Remove from Favorites" : "Add to Favorites"}
            >
              ♥
            </button>
            <button onClick={handleWatchlistClick}>
              {inWatchlist ? "✓ In Watchlist" : "+ Watchlist"}
            </button>
          </div>
        </div>
      </Link>

      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p>{movie.release_date?.split("-")[0]}</p>
      </div>
      <div className="movie-rating">
        {renderStars(movie.vote_average)}
      </div>
      <div className="movie-genres">
        {movie.genre_ids?.slice(0, 2).map((id) => (
        <span key={id} className="genre-tag">
        {genreMap[id] || "Unknown"}
      </span>
  ))}
    </div>
  </div>
  );
}

export default MovieCard;
