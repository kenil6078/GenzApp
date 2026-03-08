const https = require('https');
const dns = require('dns');
const axios = require('axios');

// Force IPv4 DNS resolution to avoid network blocks on IPv6
dns.setDefaultResultOrder('ipv4first');

const TMDB_BASE = 'https://api.tmdb.org/3';
const TMDB_TOKEN = process.env.TMDB_READ_TOKEN;
const TMDB_KEY = process.env.TMDB_API_KEY;

// Force IPv4 for the entire process if not already set
dns.setDefaultResultOrder('ipv4first');

const tmdbAxios = axios.create({
  baseURL: TMDB_BASE,
  timeout: 30000, // 30 second timeout for slow connections
  httpsAgent: new https.Agent({ family: 4 }), // Force IPv4
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'Mozilla/5.0',
    'Authorization': `Bearer ${TMDB_TOKEN}`,
  },
});

const proxyTmdb = async (req, res) => {
  const tmdbPath = req.path || '/';
  const queryParams = { ...req.query, api_key: TMDB_KEY };

  try {
    const response = await tmdbAxios.get(tmdbPath, { params: queryParams });
    return res.json(response.data);
  } catch (err) {
    
    // Last ditch fallback: If it's a timeout, try one more time with even longer timeout
    if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
       try {
         const retryRes = await tmdbAxios.get(tmdbPath, { 
           params: queryParams, 
           timeout: 60000 
         });
         return res.json(retryRes.data);
       } catch (retryErr) {
         return res.status(504).json({ error: "TMDB Request Timed Out after retry", details: retryErr.message });
       }
    }

    const status = err.response?.status || 502;
    res.status(status).json({ 
      error: "TMDB Unreachable",
      details: err.response?.data?.status_message || err.message
    });
  }
};

module.exports = { proxyTmdb };
