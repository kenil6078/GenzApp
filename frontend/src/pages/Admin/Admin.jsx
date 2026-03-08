import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  getAdminStats, getAllUsers, toggleBanUser, deleteUser,
  getAdminMovies, createAdminMovie, updateAdminMovie, deleteAdminMovie
} from '../../services/authApi';
import { Loader } from '../../components/Loader/Loader';
import './Admin.css';

const INITIAL_MOVIE_FORM = {
  title: '', tmdbId: '', posterUrl: '', backdropUrl: '', description: '',
  releaseDate: '', genre: '', category: 'movie', trailerUrl: '', rating: '',
};

const Admin = () => {
  const { userInfo } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [movieForm, setMovieForm] = useState(INITIAL_MOVIE_FORM);
  const [editMovieId, setEditMovieId] = useState(null);
  const [showMovieForm, setShowMovieForm] = useState(false);

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, moviesRes] = await Promise.all([
        getAdminStats(), getAllUsers(), getAdminMovies()
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setMovies(moviesRes.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleBanUser = async (id) => {
    try {
      const { data } = await toggleBanUser(id);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isBanned: data.isBanned } : u));
      setStats(prev => ({ ...prev, bannedUsers: data.isBanned ? prev.bannedUsers + 1 : prev.bannedUsers - 1 }));
    } catch (e) { console.error(e); }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(u => u._id !== id));
      setStats(prev => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
    } catch (e) { console.error(e); }
  };

  const handleMovieSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...movieForm,
      tmdbId: movieForm.tmdbId ? Number(movieForm.tmdbId) : undefined,
      rating: movieForm.rating ? Number(movieForm.rating) : 0,
      genre: movieForm.genre ? movieForm.genre.split(',').map(g => g.trim()) : [],
    };
    try {
      if (editMovieId) {
        await updateAdminMovie(editMovieId, payload);
      } else {
        await createAdminMovie(payload);
      }
      await fetchData();
      setMovieForm(INITIAL_MOVIE_FORM);
      setEditMovieId(null);
      setShowMovieForm(false);
    } catch (e) { console.error(e); }
  };

  const handleEditMovie = (movie) => {
    setMovieForm({
      title: movie.title || '',
      tmdbId: movie.tmdbId || '',
      posterUrl: movie.posterUrl || '',
      backdropUrl: movie.backdropUrl || '',
      description: movie.description || '',
      releaseDate: movie.releaseDate || '',
      genre: Array.isArray(movie.genre) ? movie.genre.join(', ') : '',
      category: movie.category || 'movie',
      trailerUrl: movie.trailerUrl || '',
      rating: movie.rating || '',
    });
    setEditMovieId(movie._id);
    setShowMovieForm(true);
  };

  const handleDeleteMovie = async (id) => {
    if (!window.confirm('Delete this movie?')) return;
    try {
      await deleteAdminMovie(id);
      setMovies(prev => prev.filter(m => m._id !== id));
    } catch (e) { console.error(e); }
  };

  if (loading) return <div className="admin-page"><Loader /></div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>⚙️ Admin Dashboard</h1>
        <p>Manage your platform</p>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        {['stats', 'users', 'movies'].map(tab => (
          <button
            key={tab}
            className={`admin-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'stats' ? '📊 Overview' : tab === 'users' ? '👥 Users' : '🎬 Movies'}
          </button>
        ))}
      </div>

      {/* Stats Tab */}
      {activeTab === 'stats' && stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-value">{stats.totalUsers}</div>
            <div className="stat-label">Total Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🚫</div>
            <div className="stat-value">{stats.bannedUsers}</div>
            <div className="stat-label">Banned Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎬</div>
            <div className="stat-value">{stats.totalMovies}</div>
            <div className="stat-label">Admin Movies</div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="admin-section">
          <h2>All Users ({users.length})</h2>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id} className={user.isBanned ? 'banned-row' : ''}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.role}`}>{user.role}</span>
                    </td>
                    <td>
                      <span className={`status-badge ${user.isBanned ? 'banned' : 'active'}`}>
                        {user.isBanned ? '🚫 Banned' : '✅ Active'}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      {user.role !== 'admin' && (
                        <div className="action-btns">
                          <button
                            className={`action-btn ${user.isBanned ? 'unban' : 'ban'}`}
                            onClick={() => handleBanUser(user._id)}
                          >
                            {user.isBanned ? 'Unban' : 'Ban'}
                          </button>
                          <button
                            className="action-btn delete"
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Movies Tab */}
      {activeTab === 'movies' && (
        <div className="admin-section">
          <div className="section-top">
            <h2>Admin Movies ({movies.length})</h2>
            <button className="add-movie-btn" onClick={() => { setShowMovieForm(!showMovieForm); setEditMovieId(null); setMovieForm(INITIAL_MOVIE_FORM); }}>
              {showMovieForm ? '✕ Cancel' : '+ Add Movie'}
            </button>
          </div>

          {showMovieForm && (
            <form className="movie-form" onSubmit={handleMovieSubmit}>
              <h3>{editMovieId ? 'Edit Movie' : 'Add New Movie'}</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Title *</label>
                  <input required value={movieForm.title} onChange={e => setMovieForm({...movieForm, title: e.target.value})} placeholder="Movie title" />
                </div>
                <div className="form-group">
                  <label>TMDB ID</label>
                  <input value={movieForm.tmdbId} onChange={e => setMovieForm({...movieForm, tmdbId: e.target.value})} placeholder="123456" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Poster URL</label>
                  <input value={movieForm.posterUrl} onChange={e => setMovieForm({...movieForm, posterUrl: e.target.value})} placeholder="https://..." />
                </div>
                <div className="form-group">
                  <label>Trailer YouTube Link</label>
                  <input value={movieForm.trailerUrl} onChange={e => setMovieForm({...movieForm, trailerUrl: e.target.value})} placeholder="https://youtube.com/watch?v=..." />
                </div>
              </div>
              <div className="form-group full-width">
                <label>Description</label>
                <textarea value={movieForm.description} onChange={e => setMovieForm({...movieForm, description: e.target.value})} placeholder="Movie description..." rows={3} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Release Date</label>
                  <input type="date" value={movieForm.releaseDate} onChange={e => setMovieForm({...movieForm, releaseDate: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Genre (comma-separated)</label>
                  <input value={movieForm.genre} onChange={e => setMovieForm({...movieForm, genre: e.target.value})} placeholder="Action, Drama" />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select value={movieForm.category} onChange={e => setMovieForm({...movieForm, category: e.target.value})}>
                    <option value="movie">Movie</option>
                    <option value="tv">TV Show</option>
                    <option value="trending">Trending</option>
                    <option value="popular">Popular</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Rating (0-10)</label>
                  <input type="number" min="0" max="10" step="0.1" value={movieForm.rating} onChange={e => setMovieForm({...movieForm, rating: e.target.value})} placeholder="8.5" />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">
                  {editMovieId ? 'Update Movie' : 'Add Movie'}
                </button>
              </div>
            </form>
          )}

          {movies.length === 0 ? (
            <div className="no-movies"><p>No admin movies added yet. Add one above!</p></div>
          ) : (
            <div className="movies-table-grid">
              {movies.map(movie => (
                <div key={movie._id} className="admin-movie-card">
                  <img
                    src={movie.posterUrl || 'https://via.placeholder.com/100x150/1a1a2e/7c3aed?text=No+Poster'}
                    alt={movie.title}
                    onError={e => { e.target.src = 'https://via.placeholder.com/100x150/1a1a2e/7c3aed?text=No+Poster'; }}
                  />
                  <div className="admin-movie-info">
                    <h4>{movie.title}</h4>
                    <p>{movie.category} • {movie.releaseDate?.slice(0,4) || 'N/A'}</p>
                    <div className="admin-movie-actions">
                      <button className="action-btn edit" onClick={() => handleEditMovie(movie)}>Edit</button>
                      <button className="action-btn delete" onClick={() => handleDeleteMovie(movie._id)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;
