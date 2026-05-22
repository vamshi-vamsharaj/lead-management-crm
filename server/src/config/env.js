

require('dotenv').config();

// ── Validation helper ─────────────────────────────────────────────────────────
function requireEnv(key) {
  const value = process.env[key];
  if (!value) {
    // Crash immediately with a human-readable error.
    console.error(`\n❌ FATAL: Missing required environment variable: ${key}`);
    console.error(`   Add it to your .env file. See .env.example for reference.\n`);
    process.exit(1);
  }
  return value;
}

// ── Config object ─────────────────────────────────────────────────────────────
const config = {
  // Server
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT:     parseInt(process.env.PORT || '5000', 10),
  isDev:    (process.env.NODE_ENV || 'development') === 'development',
  isProd:   process.env.NODE_ENV === 'production',

  // Database
  db: {
    host:     process.env.DB_HOST     || 'localhost',
    port:     parseInt(process.env.DB_PORT || '5432', 10),
    name:     requireEnv('DB_NAME'),
    user:     requireEnv('DB_USER'),
    password: requireEnv('DB_PASSWORD'),
    ssl:      process.env.DB_SSL === 'true',
  },

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
};

module.exports = config;