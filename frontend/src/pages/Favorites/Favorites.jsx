import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavorites, removeFromFavorites } from '../../redux/favoriteSlice';
import { TMDB_IMAGE_W500, PLACEHOLDER_IMAGE } from '../../utils/constants';
import { Loader } from '../../components/Loader/Loader';
import './Favorites.css';

const Favorites = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.favorites);
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    if (userInfo) dispatch(fetchFavorites());
  }, [userInfo]);

  if (loading) return <div className="favorites-page"><Loader /></div>;

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h1>❤️ My Favorites</h1>
        <p>{items.length} {items.length === 1 ? 'movie' : 'movies'} saved</p>
      </div>

      {items.length === 0 ? (
        <div className="favorites-empty">
          <div className="empty-icon">💔</div>
          <h2>No favorites yet</h2>
          <p>Start adding movies and shows you love!</p>
          <Link to="/" className="explore-btn">Explore Movies</Link>
        </div>
      ) : (
        <div className="movies-grid">
          {items.map((item) => (
            <div key={item._id} className="favorite-item">
              <Link to={`/${item.mediaType}/${item.tmdbId}`} className="fav-card-link">
                <div className="fav-poster">
                  <img
                    src={item.posterUrl || PLACEHOLDER_IMAGE}
                    alt={item.title}
                    loading="lazy"
                    onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
                  />
                  {item.rating > 0 && (
                    <div className="fav-rating">⭐ {item.rating?.toFixed(1)}</div>
                  )}
                </div>
                <div className="fav-info">
                  <h3>{item.title}</h3>
                  <div className="fav-meta">
                    {item.releaseDate && <span>{item.releaseDate}</span>}
                    <span className={`type-badge ${item.mediaType}`}>
                      {item.mediaType === 'tv' ? 'TV' : 'Movie'}
                    </span>
                  </div>
                </div>
              </Link>
              <button
                className="remove-fav-btn"
                onClick={() => dispatch(removeFromFavorites(item.tmdbId))}
                aria-label="Remove from favorites"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
