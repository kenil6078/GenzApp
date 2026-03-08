import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { fetchPopularMovies } from '../../redux/movieSlice';
import MovieCard from '../../components/MovieCard/MovieCard';
import { SkeletonGrid } from '../../components/Loader/Loader';
import { GENRES } from '../../utils/constants';
import { getTopRatedMovies, getUpcomingMovies, discoverMoviesByGenre, getPopularMovies } from '../../services/tmdbApi';
import './Movies.css';

const CATEGORIES = [
  { key: 'popular', label: 'Popular' },
  { key: 'top_rated', label: 'Top Rated' },
  { key: 'upcoming', label: 'Upcoming' },
];

const Movies = () => {
  const dispatch = useDispatch();
  const { popular, loading } = useSelector((state) => state.movies);
  const [activeCategory, setActiveCategory] = useState('popular');
  const [activeGenre, setActiveGenre] = useState(null);
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [fetching, setFetching] = useState(false);

  const fetchMovies = useCallback(async (cat, genre, p = 1) => {
    setFetching(true);
    try {
      let response;
      if (genre) {
        response = await discoverMoviesByGenre(genre, p);
      } else if (cat === 'popular') {
        response = await getPopularMovies(p);
        const { results, total_pages } = response.data;
        if (p === 1) setMovies(results); else setMovies(prev => [...prev, ...results]);
        setTotalPages(total_pages);
        setFetching(false);
        return;
      } else if (cat === 'top_rated') {
        response = await getTopRatedMovies(p);
      } else {
        response = await getUpcomingMovies(p);
      }
      const { results, total_pages } = response.data;
      if (p === 1) setMovies(results); else setMovies(prev => [...prev, ...results]);
      setTotalPages(total_pages);
    } catch (e) { console.error(e); }
    setFetching(false);
  }, []);

  useEffect(() => {
    setPage(1);
    fetchMovies(activeCategory, activeGenre, 1);
  }, [activeCategory, activeGenre]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchMovies(activeCategory, activeGenre, next);
  };

  const genreList = Object.entries(GENRES).slice(0, 10);

  return (
    <div className="movies-page">
      <div className="movies-header">
        <h1>🎬 Movies</h1>
        <div className="filter-row">
          <div className="category-tabs">
            {CATEGORIES.map(c => (
              <button
                key={c.key}
                className={`tab-btn ${activeCategory === c.key && !activeGenre ? 'active' : ''}`}
                onClick={() => { setActiveCategory(c.key); setActiveGenre(null); }}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="genre-tabs">
            {genreList.map(([id, name]) => (
              <button
                key={id}
                className={`genre-btn ${activeGenre === Number(id) ? 'active' : ''}`}
                onClick={() => setActiveGenre(activeGenre === Number(id) ? null : Number(id))}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {fetching && movies.length === 0 ? (
        <SkeletonGrid count={16} />
      ) : (
        <InfiniteScroll
          dataLength={movies.length}
          next={loadMore}
          hasMore={page < totalPages}
          loader={<SkeletonGrid count={8} />}
          endMessage={<p className="end-message">🎬 You've seen it all!</p>}
        >
          <div className="movies-grid">
            {movies.map((movie) => (
              <MovieCard key={`${movie.id}-${movie.title}`} movie={movie} mediaType="movie" />
            ))}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
};

export default Movies;
