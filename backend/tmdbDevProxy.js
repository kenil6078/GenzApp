const http = require('http');
const https = require('https');
const axios = require('axios');
require('dotenv').config();

const TMDB_KEY = process.env.TMDB_API_KEY;
const PORT = 5001;

if (!TMDB_KEY) {
  console.error('❌ TMDB_API_KEY not found in .env');
  process.exit(1);
}

const tmdbAxios = axios.create({
  baseURL: 'https://api.tmdb.org/3',
  timeout: 15000,
  params: { api_key: TMDB_KEY }
});

const server = http.createServer(async (req, res) => {
  // Add CORS headers for local access
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    const path = url.pathname;
    const query = Object.fromEntries(url.searchParams);
    
    const response = await tmdbAxios.get(path, { params: query });
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(response.data));
  } catch (err) {
    const status = err.response?.status || 500;
    const body = err.response?.data || { error: err.message };
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(body));
  }
});

server.listen(PORT, () => {
  console.log(`🚀 No-Framework TMDB Proxy running on http://localhost:${PORT}`);
});
