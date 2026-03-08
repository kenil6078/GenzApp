import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMovieDetails, getTVDetails, getMovieTrailer, getTVTrailer } from '../../services/tmdbApi';
import { addToHistory } from '../../services/authApi';
import { addToFavorites, removeFromFavorites } from '../../redux/favoriteSlice';
import TrailerModal from '../../components/TrailerModal/TrailerModal';
import { Loader } from '../../components/Loader/Loader';
import { TMDB_IMAGE_BASE_URL, TMDB_IMAGE_W500, PLACEHOLDER_IMAGE, GENRES } from '../../utils/constants';
import './MovieDetails.css';

const MovieDetails = () => {
  const { type, id } = useParams();
  const [details, setDetails] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const { items: favorites } = useSelector((state) => state.favorites);

  const mediaType = type === 'tv' ? 'tv' : 'movie';
  const isFav = favorites.some((f) => f.tmdbId === Number(id));

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const detailFn = mediaType === 'tv' ? getTVDetails : getMovieDetails;
        const trailerFn = mediaType === 'tv' ? getTVTrailer : getMovieTrailer;
        const { data } = await detailFn(id);
        setDetails(data);

        if (userInfo) {
          addToHistory({
            tmdbId: data.id,
            mediaType,
            title: data.title || data.name,
            posterUrl: data.poster_path ? `${TMDB_IMAGE_W500}${data.poster_path}` : '',
            rating: data.vote_average,
            releaseDate: (data.release_date || data.first_air_date || '').slice(0, 4),
          }).catch(() => {});
        }

        const { data: videoData } = await trailerFn(id);
        const trailer = videoData.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
        setTrailerKey(trailer?.key || null);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetchDetails();
  }, [id, type]);

  if (loading) return <div className="details-loading"><Loader /></div>;
  if (!details) return <div className="details-error"><p>Movie not found.</p></div>;

  const title = details.title || details.name;
  const backdrop = details.backdrop_path
    ? `${TMDB_IMAGE_BASE_URL}${details.backdrop_path}` : '';
  const poster = details.poster_path
    ? `${TMDB_IMAGE_W500}${details.poster_path}` : PLACEHOLDER_IMAGE;
  const year = (details.release_date || details.first_air_date || '').slice(0, 4);
  const rating = details.vote_average?.toFixed(1);
  const genreNames = details.genres?.map(g => g.name).join(', ') || 'N/A';
  const cast = details.credits?.cast?.slice(0, 8) || [];
  const similar = (details.similar?.results || []).slice(0, 8);

  const handleFavorite = () => {
    if (!userInfo) return;
    if (isFav) {
      dispatch(removeFromFavorites(details.id));
    } else {
      dispatch(addToFavorites({
        tmdbId: details.id, mediaType, title,
        posterUrl: poster, rating: details.vote_average, releaseDate: year,
      }));
    }
  };

  return (
    <div className="movie-details-page">
      {backdrop && (
        <div
          className="details-backdrop"
          style={{ backgroundImage: `url(${backdrop})` }}
        >
          <div className="details-backdrop-overlay"></div>
        </div>
      )}

      <div className="details-content">
        <div className="details-main">
          <div className="details-poster">
            <img src={poster} alt={title} />
          </div>
          <div className="details-info">
            <h1 className="details-title">{title}</h1>
            <div className="details-meta">
              {year && <span className="meta-tag">{year}</span>}
              {rating > 0 && <span className="meta-tag rating">⭐ {rating}</span>}
              <span className="meta-tag">{mediaType === 'tv' ? 'TV Show' : 'Movie'}</span>
              {details.runtime && <span className="meta-tag">{details.runtime} min</span>}
            </div>
            {genreNames !== 'N/A' && (
              <div className="details-genres">
                {details.genres?.map(g => (
                  <span key={g.id} className="genre-tag">{g.name}</span>
                ))}
              </div>
            )}
            <p className="details-overview">
              {details.overview || 'Description not available.'}
            </p>
            <div className="details-actions">
              <button
                className="btn-trailer"
                onClick={() => setShowTrailer(true)}
              >
                ▶ {trailerKey ? 'Watch Trailer' : 'Trailer Unavailable'}
              </button>
              {userInfo && (
                <button
                  className={`btn-favorite ${isFav ? 'active' : ''}`}
                  onClick={handleFavorite}
                >
                  {isFav ? '❤️ In Favorites' : '🤍 Add to Favorites'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Cast */}
        {cast.length > 0 && (
          <section className="details-section">
            <h2>🎭 Cast</h2>
            <div className="cast-grid">
              {cast.map(member => (
                <Link to={`/person/${member.id}`} key={member.id} className="cast-card">
                  <div className="cast-photo">
                    <img
                      src={member.profile_path ? `${TMDB_IMAGE_W500}${member.profile_path}` : PLACEHOLDER_IMAGE}
                      alt={member.name}
                      loading="lazy"
                      onError={e => { e.target.src = PLACEHOLDER_IMAGE; }}
                    />
                  </div>
                  <div className="cast-info">
                    <p className="cast-name">{member.name}</p>
                    <p className="cast-role">{member.character}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Similar */}
        {similar.length > 0 && (
          <section className="details-section">
            <h2>🎬 Similar {mediaType === 'tv' ? 'Shows' : 'Movies'}</h2>
            <div className="movies-grid">
              {similar.map(m => (
                <Link to={`/${mediaType}/${m.id}`} key={m.id} className="movie-card-link">
                  <img
                    src={m.poster_path ? `${TMDB_IMAGE_W500}${m.poster_path}` : PLACEHOLDER_IMAGE}
                    alt={m.title || m.name}
                    className="similar-poster"
                    loading="lazy"
                    onError={e => { e.target.src = PLACEHOLDER_IMAGE; }}
                  />
                  <p className="similar-title">{m.title || m.name}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {showTrailer && (
        <TrailerModal
          videoKey={trailerKey}
          title={`${title} - Trailer`}
          onClose={() => setShowTrailer(false)}
        />
      )}
    </div>
  );
};

export default MovieDetails;
