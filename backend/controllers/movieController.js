const Movie = require('../models/Movie');

// @desc    Get all admin-added movies
// @route   GET /api/movies
const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find().populate('createdBy', 'name email');
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single movie
// @route   GET /api/movies/:id
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create movie (admin)
// @route   POST /api/movies
const createMovie = async (req, res) => {
  try {
    const { title, tmdbId, posterUrl, backdropUrl, description, releaseDate, genre, category, trailerUrl, rating } = req.body;
    const movie = await Movie.create({
      title, tmdbId, posterUrl, backdropUrl, description,
      releaseDate, genre, category, trailerUrl, rating,
      createdBy: req.user._id,
    });
    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update movie (admin)
// @route   PUT /api/movies/:id
const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete movie (admin)
// @route   DELETE /api/movies/:id
const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMovies, getMovieById, createMovie, updateMovie, deleteMovie };
