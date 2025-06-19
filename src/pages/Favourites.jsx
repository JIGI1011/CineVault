import "../css/Favourites.css";
import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import { auth } from "../services/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { getFavorites } from "../services/favouriteService";

function Favorites() {
  const [user] = useAuthState(auth);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (user) {
        const favs = await getFavorites(user.uid);
        setFavorites(favs);
      }
      setLoading(false);
    };

    fetchFavorites();
  }, [user]);

  if (loading) {
    return <div className="favorites">Loading favorites...</div>;
  }

  if (!user) {
    return (
      <div className="favorites-empty">
        <h2>Please log in to view your favorites.</h2>
      </div>
    );
  }

  if (favorites.length > 0) {
    return (
      <div className="favorites">
        <h2>Your Favorites</h2>
        <div className="movies-grid">
          {favorites.map((movie) => (
            <MovieCard movie={movie} key={movie.id} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-empty">
      <h2>No Favorite Movies Yet</h2>
      <p>Start adding movies to your favorites and they will appear here!</p>
    </div>
  );
}

export default Favorites;
