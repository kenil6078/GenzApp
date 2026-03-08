import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToFavorites, removeFromFavorites } from '../../redux/favoriteSlice';
import { TMDB_IMAGE_W500, PLACEHOLDER_IMAGE } from '../../utils/constants';
import './MovieCard.css';

const MovieCard = ({ movie, mediaType }) => {
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const { items: favorites } = useSelector((state) => state.favorites);

  const id = movie.id || movie.tmdbId;
  const type = mediaType || movie.media_type || (movie.title ? 'movie' : 'tv');
  const title = movie.title || movie.name || 'Unknown Title';
  const poster = imgError
    ? PLACEHOLDER_IMAGE
    : movie.posterUrl || (movie.poster_path ? `${TMDB_IMAGE_W500}${movie.poster_path}` : PLACEHOLDER_IMAGE);
  const rating = movie.vote_average || movie.rating || 0;
  const year = (movie.release_date || movie.first_air_date || movie.releaseDate || '').slice(0, 4);

  const isFav = favorites.some((f) => f.tmdbId === id);

  const handleFavorite = (e) => {
    e.preventDefault();
    if (!userInfo) return;
    if (isFav) {
      dispatch(removeFromFavorites(id));
    } else {
      dispatch(addToFavorites({
        tmdbId: id,
        mediaType: type,
        title,
        posterUrl: poster,
        rating: Math.round(rating * 10) / 10,
        releaseDate: year,
      }));
    }
  };

  return (
    <Link
      to={`/${type}/${id}`}
      className="movie-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="movie-card-poster">
        <img
          src={poster}
          alt={title}
          loading="lazy"
          onError={() => setImgError(true)}
        />
        <div className={`movie-card-overlay ${isHovered ? 'visible' : ''}`}>
          <div className="movie-card-overlay-content">
            <span className="view-details-btn">View Details</span>
          </div>
        </div>
        {userInfo && (
          <button
            className={`fav-btn ${isFav ? 'fav-active' : ''}`}
            onClick={handleFavorite}
            aria-label="Toggle favorite"
          >
            {isFav ? '❤️' : '🤍'}
          </button>
        )}
        {rating > 0 && (
          <div className="rating-badge">
            ⭐ {rating.toFixed(1)}
          </div>
        )}
      </div>
      <div className="movie-card-info">
        <h3 className="movie-card-title">{title}</h3>
        <div className="movie-card-meta">
          {year && <span className="movie-year">{year}</span>}
          <span className={`media-type-badge ${type}`}>
            {type === 'tv' ? 'TV' : 'Movie'}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
