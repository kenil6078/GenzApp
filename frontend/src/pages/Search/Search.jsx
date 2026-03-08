import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MovieCard from '../../components/MovieCard/MovieCard';
import { SkeletonGrid } from '../../components/Loader/Loader';
import './Search.css';

const Search = () => {
  const { search, searchLoading } = useSelector((state) => state.movies);
  const navigate = useNavigate();

  const filteredResults = search.results.filter(
    (item) => item.media_type !== 'person'
  );
  const people = search.results.filter(
    (item) => item.media_type === 'person'
  );

  return (
    <div className="search-page">
      {search.query ? (
        <div className="search-header">
          <h1>Search Results</h1>
          <p>Results for: <span className="query-text">"{search.query}"</span></p>
        </div>
      ) : (
        <div className="search-empty">
          <div className="search-empty-icon">🔍</div>
          <h2>Search for movies, shows, or people</h2>
          <p>Use the search bar in the navigation to get started</p>
        </div>
      )}

      {searchLoading && search.results.length === 0 && <SkeletonGrid count={12} />}

      {!searchLoading && search.query && search.results.length === 0 && (
        <div className="no-results">
          <div className="no-results-icon">🎬</div>
          <h2>No results found</h2>
          <p>Try searching with different keywords</p>
        </div>
      )}

      {filteredResults.length > 0 && (
        <section className="search-section">
          <h2>Movies & Shows ({filteredResults.length})</h2>
          <div className="movies-grid">
            {filteredResults.map((item) => (
              <MovieCard key={`${item.id}-${item.media_type}`} movie={item} />
            ))}
          </div>
        </section>
      )}

      {people.length > 0 && (
        <section className="search-section">
          <h2>People ({people.length})</h2>
          <div className="people-results">
            {people.map((person) => (
              <div key={person.id} className="person-result" onClick={() => navigate(`/person/${person.id}`)}>
                <img
                  src={person.profile_path
                    ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
                    : 'https://via.placeholder.com/80x80/1a1a2e/7c3aed?text=?'}
                  alt={person.name}
                  onError={e => { e.target.src = 'https://via.placeholder.com/80x80/1a1a2e/7c3aed?text=?'; }}
                />
                <div>
                  <p className="person-name">{person.name}</p>
                  <p className="person-dept">{person.known_for_department || 'Actor'}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Search;
