import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getHistory, clearHistory } from '../../services/authApi';
import { useSelector } from 'react-redux';
import { PLACEHOLDER_IMAGE } from '../../utils/constants';
import { Loader } from '../../components/Loader/Loader';
import './WatchHistory.css';

const WatchHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useSelector((state) => state.user);

  const fetchHistory = async () => {
    try {
      const { data } = await getHistory();
      setHistory(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => {
    if (userInfo) fetchHistory();
    else setLoading(false);
  }, [userInfo]);

  const handleClear = async () => {
    if (!window.confirm('Clear all watch history?')) return;
    try {
      await clearHistory();
      setHistory([]);
    } catch (e) { console.error(e); }
  };

  const formatDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) return <div className="history-page"><Loader /></div>;

  return (
    <div className="history-page">
      <div className="history-header">
        <div>
          <h1>🕐 Watch History</h1>
          <p>{history.length} {history.length === 1 ? 'item' : 'items'} watched</p>
        </div>
        {history.length > 0 && (
          <button className="clear-btn" onClick={handleClear}>🗑 Clear All</button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="history-empty">
          <div className="empty-icon">🎞️</div>
          <h2>No watch history</h2>
          <p>Movies you watch or view will appear here</p>
          <Link to="/" className="explore-btn">Explore Movies</Link>
        </div>
      ) : (
        <div className="history-list">
          {history.map((item) => (
            <Link to={`/${item.mediaType}/${item.tmdbId}`} key={item._id} className="history-item">
              <div className="history-poster">
                <img
                  src={item.posterUrl || PLACEHOLDER_IMAGE}
                  alt={item.title}
                  onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
                />
              </div>
              <div className="history-info">
                <h3>{item.title}</h3>
                <div className="history-meta">
                  {item.releaseDate && <span>{item.releaseDate}</span>}
                  <span className={`type-badge-sm ${item.mediaType}`}>
                    {item.mediaType === 'tv' ? 'TV' : 'Movie'}
                  </span>
                  {item.rating > 0 && <span className="history-rating">⭐ {Number(item.rating).toFixed(1)}</span>}
                </div>
                <p className="watch-date">Watched: {formatDate(item.watchedAt)}</p>
              </div>
              <div className="history-arrow">›</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchHistory;
