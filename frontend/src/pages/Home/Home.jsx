import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrending, fetchPopularMovies, fetchPopularTV } from '../../redux/movieSlice';
import { fetchFavorites } from '../../redux/favoriteSlice';
import MovieCard from '../../components/MovieCard/MovieCard';
import { SkeletonGrid } from '../../components/Loader/Loader';
import { TMDB_IMAGE_BASE_URL, PLACEHOLDER_IMAGE } from '../../utils/constants';
import './Home.css';

const Home = () => {
  const dispatch = useDispatch();
  const { trending, popular, loading } = useSelector((state) => state.movies);
  const { userInfo } = useSelector((state) => state.user);
  const heroRef = useRef(null);

  useEffect(() => {
    dispatch(fetchTrending());
    dispatch(fetchPopularMovies(1));
    dispatch(fetchPopularTV(1));
    if (userInfo) dispatch(fetchFavorites());
  }, [dispatch, userInfo]);

  const hero = trending[0];
  const heroTitle = hero?.title || hero?.name || 'Discover Movies';
  const heroOverview = hero?.overview || '';
  const heroPoster = hero?.backdrop_path
    ? `${TMDB_IMAGE_BASE_URL}${hero.backdrop_path}`
    : PLACEHOLDER_IMAGE;

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section
        className="hero-section"
        style={{ backgroundImage: `url(${heroPoster})` }}
        ref={heroRef}
      >
        <div className="hero-overlay">
          <div className="hero-content">
            <div className="hero-badge">🔥 Trending Now</div>
            <h1 className="hero-title">{heroTitle}</h1>
            <p className="hero-overview">{heroOverview.slice(0, 200)}{heroOverview.length > 200 ? '...' : ''}</p>
            <div className="hero-actions">
              {hero && (
                <Link
                  to={`/${hero.media_type || 'movie'}/${hero.id}`}
                  className="hero-btn primary"
                >
                  ▶ Watch Now
                </Link>
              )}
              <Link to="/movies" className="hero-btn secondary">Explore More</Link>
            </div>
          </div>
        </div>
      </section>

      <div className="home-sections">
        {/* Trending Section */}
        <section className="content-section">
          <div className="section-header">
            <h2>🔥 Trending Today</h2>
            <Link to="/movies" className="see-all-link">See All →</Link>
          </div>
          {loading && trending.length === 0 ? (
            <SkeletonGrid count={8} />
          ) : (
            <div className="movies-grid">
              {trending.slice(0, 12).map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </section>

        {/* Popular Movies Section */}
        <section className="content-section">
          <div className="section-header">
            <h2>🎬 Popular Movies</h2>
            <Link to="/movies" className="see-all-link">See All →</Link>
          </div>
          {loading && popular.results.length === 0 ? (
            <SkeletonGrid count={8} />
          ) : (
            <div className="movies-grid">
              {popular.results.slice(0, 12).map((movie) => (
                <MovieCard key={movie.id} movie={movie} mediaType="movie" />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
