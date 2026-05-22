/**
 * src/app.js
 *
 * Express application factory.
 *
 * WHY SEPARATE app.js FROM server.js?
 *   server.js does ONE thing: start the HTTP server on a port.
 *   app.js configures the Express application.
 *
 *   This separation means:
 *   - Tests can import app without starting a real HTTP server
 *   - The app is independently inspectable
 *   - server.js stays minimal and clean
 *
 * MIDDLEWARE ORDER MATTERS:
 *   1. Security/CORS — must run before anything reads the request
 *   2. Request parsers — must run before routes read req.body
 *   3. Logging — runs on every request
 *   4. Routes — the actual application logic
 *   5. 404 handler — catches unmatched routes (after all routes)
 *   6. Error handler — catches all errors (must be LAST, 4-param signature)
 */

const express      = require('express');
const cors         = require('cors');
const morgan       = require('morgan');
const config       = require('./config/env');
const v1Routes     = require('./routes/v1');
const notFound     = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ── 1. CORS ───────────────────────────────────────────────────────────────────
// Must be FIRST — preflight OPTIONS requests must be handled before body parsing.
app.use(cors({
  origin:      config.corsOrigin,
  methods:     ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// ── 2. Body parsers ───────────────────────────────────────────────────────────
// Parse JSON bodies (Content-Type: application/json)
app.use(express.json({ limit: '10kb' }));  // 10kb limit prevents large payload attacks
// Parse URL-encoded bodies (Content-Type: application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: false }));

// ── 3. Request logging ────────────────────────────────────────────────────────
// morgan 'dev' format: "GET /api/v1/leads 200 12ms"
// Use 'combined' in production for full Apache-style logs
if (config.isDev) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ── 4. API routes ─────────────────────────────────────────────────────────────
app.use('/api/v1', v1Routes);

// Root route — helpful sanity check
app.get('/', (req, res) => {
  res.json({
    name:    'Lead Management API',
    version: '1.0.0',
    docs:    '/api/v1/health',
  });
});

// ── 5. 404 handler ────────────────────────────────────────────────────────────
// Catches any request that didn't match a route above
app.use(notFound);

// ── 6. Global error handler ───────────────────────────────────────────────────
// MUST be last — Express identifies it by the 4-argument signature (err, req, res, next)
app.use(errorHandler);

module.exports = app;