import { useEffect, useRef } from 'react';
import './TrailerModal.css';

const TrailerModal = ({ videoKey, onClose, title }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === modalRef.current) onClose();
  };

  return (
    <div className="trailer-backdrop" ref={modalRef} onClick={handleBackdropClick}>
      <div className="trailer-modal">
        <div className="trailer-modal-header">
          <h3>{title || 'Trailer'}</h3>
          <button onClick={onClose} className="modal-close" aria-label="Close">✕</button>
        </div>
        <div className="trailer-video-wrapper">
          {videoKey ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0&modestbranding=1`}
              title={title || 'Trailer'}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          ) : (
            <div className="no-trailer">
              <div className="no-trailer-icon">🎬</div>
              <p>Trailer for this movie is currently unavailable.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;
