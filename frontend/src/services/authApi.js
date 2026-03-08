import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Crucial for sending cookies with requests
});

// Auth
export const signupUser = (data) => api.post('/auth/signup', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const logoutUser = () => api.post('/auth/logout');
export const getUserProfile = () => api.get('/auth/profile');

// Favorites
export const addFavorite = (data) => api.post('/favorites/add', data);
export const getFavorites = () => api.get('/favorites');
export const removeFavorite = (tmdbId) => api.delete(`/favorites/remove/${tmdbId}`);
export const checkFavorite = (tmdbId) => api.get(`/favorites/check/${tmdbId}`);

// History
export const addToHistory = (data) => api.post('/history/add', data);
export const getHistory = () => api.get('/history');
export const clearHistory = () => api.delete('/history/clear');

// Admin
export const getAdminStats = () => api.get('/admin/stats');
export const getAllUsers = () => api.get('/admin/users');
export const toggleBanUser = (userId) => api.put(`/admin/users/${userId}/ban`);
export const deleteUser = (userId) => api.delete(`/admin/users/${userId}`);
export const getAdminMovies = () => api.get('/admin/movies');
export const createAdminMovie = (data) => api.post('/admin/movies', data);
export const updateAdminMovie = (id, data) => api.put(`/admin/movies/${id}`, data);
export const deleteAdminMovie = (id) => api.delete(`/admin/movies/${id}`);

export default api;
