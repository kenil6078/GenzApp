import { useEffect, useState, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import MovieCard from '../../components/MovieCard/MovieCard';
import { SkeletonGrid } from '../../components/Loader/Loader';
import { getPopularTVShows, getTopRatedTVShows, getOnTheAirTVShows, discoverTVShowsByGenre } from '../../services/tmdbApi';
import { TV_GENRES } from '../../utils/constants';
import './TVShows.css';

const CATEGORIES = [
  { key: 'popular', label: 'Popular' },
  { key: 'top_rated', label: 'Top Rated' },
  { key: 'on_the_air', label: 'On The Air' },
];

const TVShows = () => {
  const [activeCategory, setActiveCategory] = useState('popular');
  const [activeGenre, setActiveGenre] = useState(null);
  const [shows, setShows] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [fetching, setFetching] = useState(false);

  const fetchShows = useCallback(async (cat, genre, p = 1) => {
    setFetching(true);
    try {
      let response;
      if (genre) {
        response = await discoverTVShowsByGenre(genre, p);
      } else if (cat === 'top_rated') {
        response = await getTopRatedTVShows(p);
      } else if (cat === 'on_the_air') {
        response = await getOnTheAirTVShows(p);
      } else {
        response = await getPopularTVShows(p);
      }
      const { results, total_pages } = response.data;
      if (p === 1) setShows(results);
      else setShows(prev => [...prev, ...results]);
      setTotalPages(total_pages);
    } catch (e) { console.error(e); }
    setFetching(false);
  }, []);

  useEffect(() => {
    setPage(1);
    fetchShows(activeCategory, activeGenre, 1);
  }, [activeCategory, activeGenre, fetchShows]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchShows(activeCategory, activeGenre, next);
  };

  const genreList = Object.entries(TV_GENRES).slice(0, 10);

  return (
    <div className="tv-page">
      <div className="tv-header">
        <h1>📺 TV Shows</h1>
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
      {fetching && shows.length === 0 ? (
        <SkeletonGrid count={16} />
      ) : (
        <InfiniteScroll
          dataLength={shows.length}
          next={loadMore}
          hasMore={page < totalPages}
          loader={<SkeletonGrid count={8} />}
          endMessage={<p className="end-message">📺 You've seen it all!</p>}
        >
          <div className="movies-grid">
            {shows.map((show) => (
              <MovieCard key={show.id} movie={show} mediaType="tv" />
            ))}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
};

export default TVShows;
