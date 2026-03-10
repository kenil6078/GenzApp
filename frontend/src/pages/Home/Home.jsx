import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrending, fetchPopularMovies, fetchPopularTV } from '../../redux/movieSlice';
import { fetchFavorites } from '../../redux/favoriteSlice';
import MovieCard from '../../components/MovieCard/MovieCard';
import { SkeletonGrid } from '../../components/Loader/Loader';
import { TMDB_IMAGE_BASE_URL, PLACEHOLDER_IMAGE } from '../../utils/constants';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
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

  const heroMovies = trending.slice(0, 5);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section" ref={heroRef}>
        {heroMovies.length > 0 && (
          <Swiper
            modules={[Autoplay, Pagination, EffectFade]}
            effect="fade"
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop={true}
            speed={1000}
            className="hero-swiper"
          >
            {heroMovies.map((movie) => (
              <SwiperSlide key={movie.id}>
                <div
                  className="hero-slide-bg"
                  style={{
                    backgroundImage: `url(${movie.backdrop_path ? `${TMDB_IMAGE_BASE_URL}${movie.backdrop_path}` : PLACEHOLDER_IMAGE})`
                  }}
                >
                  <div className="hero-overlay">
                    <div className="hero-content">
                      <div className="hero-badge">🔥 Trending Now</div>
                      <h1 className="hero-title">{movie.title || movie.name}</h1>
                      <p className="hero-overview">
                        {(movie.overview || '').slice(0, 200)}
                        {(movie.overview || '').length > 200 ? '...' : ''}
                      </p>
                      <div className="hero-actions">
                        <Link
                          to={`/${movie.media_type || 'movie'}/${movie.id}`}
                          className="hero-btn primary"
                        >
                          ▶ Watch Now
                        </Link>
                        <Link to="/movies" className="hero-btn secondary">
                          Explore More
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
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
