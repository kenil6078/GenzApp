const express = require('express');
const router = express.Router();
const { proxyTmdb } = require('../controllers/tmdbProxyController');

// Express 5 + path-to-regexp v8 compatible wildcard
// Use app.use-style mounting so all sub-paths are captured
router.use('/', proxyTmdb);

module.exports = router;
