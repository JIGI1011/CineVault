import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getMovieDetails, getMovieTrailer } from '../services/api';
import "../css/MovieDetails.css";
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getMovieDetails(id);
        setMovie(data);

        const trailer = await getMovieTrailer(id);
        if (trailer) setTrailerKey(trailer);
      } catch (error) {
        console.error('Failed to fetch movie details:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const renderStars = () => {
    const rating = movie.vote_average / 2;
    return Array.from({ length: 5 }, (_, i) => {
      if (i + 1 <= Math.floor(rating)) return <FaStar key={i} className="star" />;
      if (i + 0.5 <= rating) return <FaStarHalfAlt key={i} className="star" />;
      return <FaRegStar key={i} className="star" />;
    });
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!movie) return <div className="error">Error loading movie.</div>;

  return (
    <div className="movie-details">
      <div className="poster">
        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
      </div>

      <div className="details">
        <h2>{movie.title}</h2>

        <div className="rating-stars">
          {renderStars()} <span>({movie.vote_average.toFixed(1)})</span>
        </div>

        <p><strong>Genres:</strong> {movie.genres.map(g => g.name).join(', ')}</p>
        <p><strong>Overview:</strong> {movie.overview}</p>

        {trailerKey && (
          <div className="trailer">
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}`}
              title="YouTube trailer"
              allowFullScreen
            ></iframe>
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieDetails;
