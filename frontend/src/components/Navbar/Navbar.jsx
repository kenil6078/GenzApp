import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/userSlice';
import { searchContent, clearSearch } from '../../redux/movieSlice';
import useDebounce from '../../hooks/useDebounce';
import { useTheme } from '../../context/ThemeContext';
import './Navbar.css';

const SearchSVG = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="search-icon-svg">
    <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" fill="#a78bfa" fillOpacity="0.25" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21.9999 22L15.6569 15.6568" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Navbar = () => {
  const [query, setQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 500);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.user);
  const { theme, toggleTheme } = useTheme();
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search trigger
  useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      dispatch(searchContent({ query: debouncedQuery, page: 1 }));
      if (location.pathname !== '/search') navigate('/search');
    } else if (debouncedQuery.trim() === '') {
      dispatch(clearSearch());
    }
  }, [debouncedQuery]);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setMobileSearchOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    setMenuOpen(false);
  };

  const handleSearchClear = () => {
    setQuery('');
    dispatch(clearSearch());
    if (location.pathname === '/search') navigate('/');
    inputRef.current?.focus();
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Movies', path: '/movies' },
    { label: 'TV Shows', path: '/tv' },
    { label: 'People', path: '/people' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🎬</span>
          <span className="logo-text">GenZ</span>
          <span className="logo-sub">FLIX</span>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="navbar-links">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Search Bar (always visible) */}
        <div className="search-bar-desktop">
          <span className="search-icon-prefix"><SearchSVG /></span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search movies, shows, people..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input-desktop"
            id="navbar-search"
          />
          {query && (
            <button className="search-clear-btn" onClick={handleSearchClear} aria-label="Clear search">
              ✕
            </button>
          )}
        </div>

        {/* Right Actions */}
        <div className="navbar-actions">

          {/* Theme toggle */}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-primary)" }}>
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-primary)" }}>
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>

          {/* Mobile search toggle */}
          <button
            className="mobile-search-toggle"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            aria-label="Toggle search"
          >
            {mobileSearchOpen ? <span className="close-icon">✕</span> : <SearchSVG />}
          </button>

          {/* Auth */}
          {userInfo ? (
            <div className="user-menu" ref={dropdownRef}>
              <button
                className="user-avatar"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-label="User menu"
              >
                {userInfo.name?.charAt(0).toUpperCase() || 'U'}
              </button>
              {dropdownOpen && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <span>{userInfo.name}</span>
                    <small>{userInfo.email}</small>
                  </div>
                  <Link to="/favorites" onClick={() => setDropdownOpen(false)}>❤️ Favorites</Link>
                  <Link to="/history" onClick={() => setDropdownOpen(false)}>🕐 Watch History</Link>
                  {userInfo.role === 'admin' && (
                    <Link to="/admin" onClick={() => setDropdownOpen(false)}>⚙️ Admin Panel</Link>
                  )}
                  <button onClick={handleLogout} className="logout-btn">🚪 Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-login">Login</Link>
              <Link to="/signup" className="btn-signup">Sign Up</Link>
            </div>
          )}

          {/* Hamburger */}
          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {mobileSearchOpen && (
        <div className="mobile-search-bar">
          <span className="search-icon-prefix"><SearchSVG /></span>
          <input
            type="text"
            placeholder="Search movies, shows, people..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input-mobile"
            autoFocus
          />
          {query && (
            <button className="search-clear-btn" onClick={handleSearchClear}>✕</button>
          )}
        </div>
      )}

      {/* Mobile Nav Menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`mobile-nav-link ${location.pathname === link.path ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <div className="mobile-menu-divider"></div>
        {userInfo ? (
          <>
            <div className="mobile-user-info">
              <span className="mobile-avatar">{userInfo.name?.charAt(0).toUpperCase()}</span>
              <div>
                <p>{userInfo.name}</p>
                <small>{userInfo.email}</small>
              </div>
            </div>
            <Link to="/favorites" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>❤️ Favorites</Link>
            <Link to="/history" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>🕐 Watch History</Link>
            {userInfo.role === 'admin' && (
              <Link to="/admin" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>⚙️ Admin Panel</Link>
            )}
            <button onClick={handleLogout} className="mobile-logout-btn">🚪 Logout</button>
          </>
        ) : (
          <div className="mobile-auth-btns">
            <Link to="/login" className="mobile-btn-login" onClick={() => setMenuOpen(false)}>Login</Link>
            <Link to="/signup" className="mobile-btn-signup" onClick={() => setMenuOpen(false)}>Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
