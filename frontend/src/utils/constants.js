export const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
export const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p/original';
export const TMDB_IMAGE_W500 = 'https://image.tmdb.org/t/p/w500';
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://genzapp.onrender.com/api';

export const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/300x450/1a1a2e/7c3aed?text=No+Poster';

export const GENRES = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
  80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
  14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
  9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 10770: 'TV Movie',
  53: 'Thriller', 10752: 'War', 37: 'Western',
};
