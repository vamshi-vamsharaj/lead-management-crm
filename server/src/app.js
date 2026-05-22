
const express      = require('express');
const cors         = require('cors');
const morgan       = require('morgan');
const config       = require('./config/env');
const v1Routes     = require('./routes/v1');
const notFound     = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({
  origin:      config.corsOrigin,
  methods:     ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json({ limit: '10kb' }));  // 10kb limit prevents large payload attacks
// Parse URL-encoded bodies (Content-Type: application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: false }));

if (config.isDev) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

app.use('/api/v1', v1Routes);
app.get('/', (req, res) => {
  res.json({
    name:    'Lead Management API',
    version: '1.0.0',
    docs:    '/api/v1/health',
  });
});

app.use(notFound);

app.use(errorHandler);

module.exports = app;