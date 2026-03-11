import { useEffect, useState, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';
import { getPopularPeople, getTrending } from '../../services/tmdbApi';
import { SkeletonGrid } from '../../components/Loader/Loader';
import { TMDB_IMAGE_W500, PLACEHOLDER_IMAGE } from '../../utils/constants';
import './People.css';

const PersonCard = ({ person }) => {
  const [imgError, setImgError] = useState(false);
  const photo = imgError || !person.profile_path
    ? PLACEHOLDER_IMAGE
    : `${TMDB_IMAGE_W500}${person.profile_path}`;

  return (
    <Link to={`/person/${person.id}`} className="person-card">
      <div className="person-photo">
        <img src={photo} alt={person.name} loading="lazy" onError={() => setImgError(true)} />
      </div>
      <div className="person-info">
        <h3>{person.name}</h3>
        <p>{person.known_for_department || 'Actor'}</p>
      </div>
    </Link>
  );
};

const CATEGORIES = [
  { key: 'popular', label: 'Popular' },
  { key: 'trending_day', label: 'Trending Today' },
  { key: 'trending_week', label: 'Trending This Week' },
];

const People = () => {
  const [activeCategory, setActiveCategory] = useState('popular');
  const [people, setPeople] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [fetching, setFetching] = useState(false);

  const fetchPeople = useCallback(async (cat, p = 1) => {
    setFetching(true);
    try {
      let response;
      if (cat === 'trending_day') {
        response = await getTrending('person', 'day', p);
      } else if (cat === 'trending_week') {
        response = await getTrending('person', 'week', p);
      } else {
        response = await getPopularPeople(p);
      }
      const { results, total_pages } = response.data;
      if (p === 1) setPeople(results);
      else setPeople(prev => [...prev, ...results]);
      setTotalPages(total_pages || 1);
    } catch (e) { console.error(e); }
    setFetching(false);
  }, []);

  useEffect(() => {
    setPage(1);
    fetchPeople(activeCategory, 1);
  }, [activeCategory, fetchPeople]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchPeople(activeCategory, next);
  };

  return (
    <div className="people-page">
      <div className="people-header">
        <h1>🌟 People</h1>
        <div className="filter-row">
          <div className="category-tabs">
            {CATEGORIES.map(c => (
              <button
                key={c.key}
                className={`tab-btn ${activeCategory === c.key ? 'active' : ''}`}
                onClick={() => setActiveCategory(c.key)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      {fetching && people.length === 0 ? (
        <SkeletonGrid count={16} />
      ) : (
        <InfiniteScroll
          dataLength={people.length}
          next={loadMore}
          hasMore={page < totalPages}
          loader={<SkeletonGrid count={8} />}
          endMessage={<p className="end-message">🌟 You've seen them all!</p>}
        >
          <div className="people-grid">
            {people.map((person) => (
              <PersonCard key={person.id} person={person} />
            ))}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
};

export default People;
