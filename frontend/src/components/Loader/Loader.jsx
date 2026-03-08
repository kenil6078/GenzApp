import './Loader.css';

export const Loader = () => (
  <div className="loader-container">
    <div className="loader-ring">
      <div></div><div></div><div></div><div></div>
    </div>
    <p className="loader-text">Loading...</p>
  </div>
);

export const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-poster skeleton-anim"></div>
    <div className="skeleton-body">
      <div className="skeleton-line skeleton-anim"></div>
      <div className="skeleton-line short skeleton-anim"></div>
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 12 }) => (
  <div className="movies-grid">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default Loader;
