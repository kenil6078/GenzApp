import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';
import { getPopularPeople } from '../../services/tmdbApi';
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

const People = () => {
  const [people, setPeople] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchPeople = async (p = 1) => {
    try {
      const { data } = await getPopularPeople(p);
      if (p === 1) setPeople(data.results);
      else setPeople(prev => [...prev, ...data.results]);
      setTotalPages(data.total_pages);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchPeople(1); }, []);
  const loadMore = () => { const next = page + 1; setPage(next); fetchPeople(next); };

  return (
    <div className="people-page">
      <div className="people-header">
        <h1>🌟 Popular People</h1>
        <p>Discover the most popular actors and filmmakers</p>
      </div>
      {loading ? (
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
