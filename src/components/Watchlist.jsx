import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";
import { getUserWatchlist } from "../services/watchlistservice";
import MovieCard from "../components/MovieCard";
import "../css/Watchlist.css";

function Watchlist() {
  const [user, loadingAuth] = useAuthState(auth); 
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    if (!loadingAuth && !user) {
      navigate("/login"); 
    }
  }, [user, loadingAuth, navigate]);

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (user) {
        const list = await getUserWatchlist(user.uid);
        setWatchlist(list);
      }
      setLoading(false);
    };

    fetchWatchlist();
  }, [user]);

  if (loading || loadingAuth) {
    return <div className="watchlist">Loading watchlist...</div>;
  }

  if (watchlist.length > 0) {
    return (
      <div className="watchlist">
        <h2>Your Watchlist</h2>
        <div className="movies-grid">
          {watchlist.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="watchlist-empty">
      <h2>Your Watchlist is Empty</h2>
      <p>Start adding movies to your watchlist and they will appear here!</p>
    </div>
  );
}

export default Watchlist;
