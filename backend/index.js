const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: [
    'https://www.bometgame.fun',
    'https://bometgame.fun',
    'http://localhost:3000',
    'http://localhost:5500',
    'http://127.0.0.1:5500'
  ],
  credentials: true
}));
app.use(express.json());

// Simple request logger to trace incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} from ${req.ip}`);
  if (req.method === 'POST' || req.method === 'PUT') {
    try { console.log('  Body:', JSON.stringify(req.body)); } catch (e) { console.log('  Body: [unserializable]'); }
  }
  next();
});

// Serve frontend static files from the public folder (Vercel expects a `public` directory)
// so you can open http://localhost:3000
app.use(express.static(path.join(__dirname, '..', 'public')));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bomet';
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0'; // bind to all interfaces (Render recommends 0.0.0.0)

// Basic validation of the connection string scheme so we fail fast with a helpful message
const maskedUri = typeof MONGODB_URI === 'string' && MONGODB_URI.length > 60
  ? MONGODB_URI.slice(0, 40) + '...' + MONGODB_URI.slice(-10)
  : MONGODB_URI;
if (!/^mongodb(\+srv)?:\/\//i.test(MONGODB_URI)) {
  console.error('\nInvalid MONGODB_URI environment variable.');
  console.error('The connection string must start with "mongodb://" or "mongodb+srv://".');
  console.error('Current value (masked):', maskedUri);
  console.error('If you are deploying on Render, set MONGODB_URI in the service Environment > Environment Variables.');
  process.exit(1);
}

// Healthcheck route for platform load balancers
app.get('/healthz', (req, res) => res.json({ ok: true, uptime: process.uptime() }));

async function startServer() {
  try {
    // Connect to MongoDB first, then start listening. This avoids accepting requests when DB is unavailable.
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    // mask the connection string for logs
    const hiddenUri = typeof MONGODB_URI === 'string' && MONGODB_URI.length > 40 ? MONGODB_URI.slice(0, 40) + '...' : MONGODB_URI;
    console.log('Connected to MongoDB:', hiddenUri);

    app.listen(PORT, HOST, () => {
      console.log(`Backend API listening on http://${HOST}:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server — MongoDB connection error:', err && err.stack ? err.stack : err);
    // Exit with non-zero so the platform (Render) knows the start failed and can retry
    process.exit(1);
  }
}

startServer();

const scoreSchema = new mongoose.Schema({
  playerName: { type: String, required: true },
  score: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  stats: { type: mongoose.Schema.Types.Mixed }
});

const Score = mongoose.model('Score', scoreSchema);

// Admin route: delete all scores (protected by ADMIN_KEY env var)
const ADMIN_KEY = process.env.ADMIN_KEY || '';
app.delete('/api/leaderboard', async (req, res) => {
  const key = req.query.key || '';
  console.log('DELETE /api/leaderboard attempt with key present=', !!key);
  if (!ADMIN_KEY || key !== ADMIN_KEY) {
    console.warn('Unauthorized attempt to clear leaderboard with key=', key);
    return res.status(401).json({ ok: false, error: 'Unauthorized. Provide ADMIN_KEY as query ?key=...' });
  }

  try {
    const result = await Score.deleteMany({});
    console.log('Leaderboard cleared, deletedCount=', result.deletedCount);
    return res.json({ ok: true, message: 'Leaderboard cleared', deletedCount: result.deletedCount });
  } catch (error) {
    console.error('Error clearing leaderboard (DELETE /api/leaderboard):', error && error.stack ? error.stack : error);
    return res.status(500).json({ ok: false, error: error.message });
  }
});

// Save a new score
app.post('/api/scores', async (req, res) => {
  try {
    const { playerName, score, date, stats } = req.body;
    console.log('POST /api/scores received:', { playerName, score, date });
    if (!playerName || typeof score !== 'number') {
      console.warn('Validation failed for POST /api/scores:', { playerName, score });
      return res.status(400).json({ error: 'playerName and numeric score are required' });
    }

    const entry = new Score({ playerName, score, date: date ? new Date(date) : new Date(), stats });
    const saved = await entry.save();
    console.log('Saved score to DB:', { id: saved._id, playerName: saved.playerName, score: saved.score });

    return res.status(201).json({ ok: true, entry: saved });
  } catch (error) {
    console.error('Error saving score (POST /api/scores):', error && error.stack ? error.stack : error);
    return res.status(500).json({ ok: false, error: error.message });
  }
});

// Get leaderboard (top N)
app.get('/api/leaderboard', async (req, res) => {
  try {
  const limit = parseInt(req.query.limit, 10) || 10;
  console.log('GET /api/leaderboard limit=', limit);
  const entries = await Score.find().sort({ score: -1, date: 1 }).limit(limit).lean();
  console.log(`Returning ${entries.length} leaderboard entries`);
  return res.json(entries);
  } catch (error) {
  console.error('Error fetching leaderboard (GET /api/leaderboard):', error && error.stack ? error.stack : error);
  return res.status(500).json({ error: error.message });
  }
});

// Redirect root to the web frontend welcome page for convenience
app.get('/', (req, res) => {
  res.redirect('/pages/welcome.html');
});

// Note: server is started from startServer() only after a successful MongoDB connection.
