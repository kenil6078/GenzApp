import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// All TMDB API calls go through our Express backend proxy at /api/tmdb/*
// Vite proxies /api/* → localhost:5000, and the backend proxies to api.themoviedb.org
// This bypasses: ERR_DNS_NO_MATCHING_SUPPORTED_ALPN (browser) and forces IPv4 on backend
const PROXY_BASE = `${API_BASE_URL}/tmdb`;

const tmdb = axios.create({
  baseURL: PROXY_BASE,
  params: {
    language: 'en-US',
  },
});

export const getTrending = (mediaType = 'all', timeWindow = 'day') =>
  tmdb.get(`/trending/${mediaType}/${timeWindow}`);

export const getPopularMovies = (page = 1) =>
  tmdb.get('/movie/popular', { params: { page } });

export const getPopularTVShows = (page = 1) =>
  tmdb.get('/tv/popular', { params: { page } });

export const getTopRatedMovies = (page = 1) =>
  tmdb.get('/movie/top_rated', { params: { page } });

export const getUpcomingMovies = (page = 1) =>
  tmdb.get('/movie/upcoming', { params: { page } });

export const getMovieDetails = (movieId) =>
  tmdb.get(`/movie/${movieId}`, { params: { append_to_response: 'credits,videos,similar' } });

export const getTVDetails = (tvId) =>
  tmdb.get(`/tv/${tvId}`, { params: { append_to_response: 'credits,videos,similar' } });

export const getMovieTrailer = (movieId) =>
  tmdb.get(`/movie/${movieId}/videos`);

export const getTVTrailer = (tvId) =>
  tmdb.get(`/tv/${tvId}/videos`);

export const searchMulti = (query, page = 1) =>
  tmdb.get('/search/multi', { params: { query, page } });

export const getPopularPeople = (page = 1) =>
  tmdb.get('/person/popular', { params: { page } });

export const getPersonDetails = (personId) =>
  tmdb.get(`/person/${personId}`, {
    params: { append_to_response: 'movie_credits,tv_credits,images' }
  });

export const discoverMoviesByGenre = (genreId, page = 1) =>
  tmdb.get('/discover/movie', { params: { with_genres: genreId, page } });

export default tmdb;
