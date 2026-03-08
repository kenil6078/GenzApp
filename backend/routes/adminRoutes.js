const express = require('express');
const router = express.Router();
const { getAllUsers, toggleBanUser, deleteUser, getStats } = require('../controllers/adminController');
const { getMovies, createMovie, updateMovie, deleteMovie } = require('../controllers/movieController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.put('/users/:id/ban', toggleBanUser);
router.delete('/users/:id', deleteUser);

// Admin movie management
router.get('/movies', getMovies);
router.post('/movies', createMovie);
router.put('/movies/:id', updateMovie);
router.delete('/movies/:id', deleteMovie);

module.exports = router;
