import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import MovieCard from '../../components/MovieCard/MovieCard';
import { SkeletonGrid } from '../../components/Loader/Loader';
import { getPopularTVShows } from '../../services/tmdbApi';
import './TVShows.css';

const TVShows = () => {
  const [shows, setShows] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchShows = async (p = 1) => {
    try {
      const { data } = await getPopularTVShows(p);
      if (p === 1) setShows(data.results);
      else setShows(prev => [...prev, ...data.results]);
      setTotalPages(data.total_pages);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchShows(1); }, []);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchShows(next);
  };

  return (
    <div className="tv-page">
      <div className="tv-header">
        <h1>📺 TV Shows</h1>
        <p>Explore the most popular TV shows</p>
      </div>
      {loading ? (
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
