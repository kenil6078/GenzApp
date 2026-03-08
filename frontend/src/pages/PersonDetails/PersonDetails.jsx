import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPersonDetails } from '../../services/tmdbApi';
import { Loader } from '../../components/Loader/Loader';
import { TMDB_IMAGE_W500, PLACEHOLDER_IMAGE } from '../../utils/constants';
import MovieCard from '../../components/MovieCard/MovieCard';
import './PersonDetails.css';

const PersonDetails = () => {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetch_ = async () => {
      try {
        const { data } = await getPersonDetails(id);
        setPerson(data);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetch_();
  }, [id]);

  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh'}}><Loader /></div>;
  if (!person) return <div style={{textAlign:'center',padding:'120px 24px',color:'rgba(255,255,255,0.5)'}}>Person not found.</div>;

  const photo = person.profile_path ? `${TMDB_IMAGE_W500}${person.profile_path}` : PLACEHOLDER_IMAGE;
  const movieCredits = person.movie_credits?.cast?.slice(0, 12) || [];
  const tvCredits = person.tv_credits?.cast?.slice(0, 8) || [];

  return (
    <div className="person-details-page">
      <div className="person-hero">
        <div className="person-hero-photo">
          <img src={photo} alt={person.name} onError={e => { e.target.src = PLACEHOLDER_IMAGE; }} />
        </div>
        <div className="person-hero-info">
          <h1>{person.name}</h1>
          <div className="person-meta">
            {person.known_for_department && <span className="person-dept-badge">{person.known_for_department}</span>}
            {person.birthday && <span className="meta-info">🎂 {person.birthday}</span>}
            {person.place_of_birth && <span className="meta-info">📍 {person.place_of_birth}</span>}
          </div>
          {person.biography && (
            <p className="person-bio">{person.biography.slice(0, 600)}{person.biography.length > 600 ? '...' : ''}</p>
          )}
        </div>
      </div>

      {movieCredits.length > 0 && (
        <section className="person-section">
          <h2>🎬 Movie Credits</h2>
          <div className="movies-grid">
            {movieCredits.map(m => (
              <MovieCard key={m.id} movie={m} mediaType="movie" />
            ))}
          </div>
        </section>
      )}

      {tvCredits.length > 0 && (
        <section className="person-section">
          <h2>📺 TV Credits</h2>
          <div className="movies-grid">
            {tvCredits.map(m => (
              <MovieCard key={m.id} movie={m} mediaType="tv" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default PersonDetails;
