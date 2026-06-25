require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ───────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Serve uploaded files (optional - for showing previews)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ───────────────────────────────────────────────────────
app.use('/api/weather',  require('./routes/weather'));
app.use('/api/market',   require('./routes/market'));
app.use('/api/disease',  require('./routes/disease'));
app.use('/api/crop',     require('./routes/crop'));

// ── Catch-all: serve index.html for any unmatched route ──────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Global Error Handler ─────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`\n🌾 Farm Ghuru server running at http://localhost:${PORT}`);
  console.log(`   Weather API  : OpenWeatherMap (set OWM_API_KEY in .env)`);
  console.log(`   Disease AI   : Google Gemini  (set GEMINI_API_KEY in .env)`);
  console.log(`   Market data  : Government APMC + curated dataset\n`);
});