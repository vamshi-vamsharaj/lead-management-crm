/**
 * src/config/db.js
 *
 * PostgreSQL connection pool.
 *
 * WHY A POOL INSTEAD OF A NEW CONNECTION PER QUERY?
 *   Opening a TCP connection to PostgreSQL takes ~50ms.
 *   Under load (100 requests/second), creating a new connection
 *   per query would be catastrophically slow and exhaust the
 *   database's connection limit.
 *
 *   A pool maintains a set of open connections (default: 10)
 *   and reuses them. A query borrows a connection, uses it,
 *   returns it to the pool. Fast and efficient.
 *
 * WHY A SINGLETON?
 *   Node.js module system caches require() calls.
 *   Every file that does `require('./config/db')` gets the same
 *   pool instance — not a new pool. This is intentional.
 *   One pool for the entire app lifetime.
 *
 * WHY EXPORT `query` DIRECTLY?
 *   Repositories call `db.query(sql, params)` — they never
 *   manage connection lifecycle themselves. The pool handles that.
 *   This keeps repository code clean and focused on SQL.
 */

const { Pool } = require('pg');
const config   = require('./env');

// ── Create pool ───────────────────────────────────────────────────────────────
const pool = new Pool({
  host:     config.db.host,
  port:     config.db.port,
  database: config.db.name,
  user:     config.db.user,
  password: config.db.password,
  ssl:      config.db.ssl ? { rejectUnauthorized: false } : false,

  // Pool sizing:
  //   max: 10 is appropriate for a single-server app.
  //   In production on large servers you'd increase this.
  max:              10,
  idleTimeoutMillis: 30000, // release idle connections after 30s
  connectionTimeoutMillis: 5000, // throw if can't get connection in 5s
});

// ── Pool event listeners ──────────────────────────────────────────────────────
pool.on('connect', () => {
  if (config.isDev) {
    console.log('🔌 New PostgreSQL connection established');
  }
});

pool.on('error', (err) => {
  // This fires for unexpected errors on idle clients.
  // Log and let the process decide whether to crash.
  console.error('❌ PostgreSQL pool error:', err.message);
});

// ── Exported interface ────────────────────────────────────────────────────────

/**
 * Execute a parameterized query.
 *
 * @param {string} text   - SQL string with $1, $2 placeholders
 * @param {Array}  params - Parameter values (prevents SQL injection)
 * @returns {Promise<QueryResult>}
 *
 * ALWAYS USE PARAMETERIZED QUERIES.
 * Never interpolate user input into SQL strings directly.
 * `db.query('SELECT * FROM leads WHERE id = $1', [id])` is safe.
 * `db.query('SELECT * FROM leads WHERE id = ' + id)` is a SQL injection vulnerability.
 */
const db = {
  query: (text, params) => pool.query(text, params),

  /**
   * Get a client for multi-statement transactions.
   * Remember to call client.release() in a finally block.
   */
  getClient: () => pool.connect(),

  /**
   * Test connectivity — called at server startup.
   */
  testConnection: async () => {
    const client = await pool.connect();
    try {
      const { rows } = await client.query('SELECT NOW() as current_time');
      console.log(`✅ PostgreSQL connected — server time: ${rows[0].current_time}`);
    } finally {
      client.release();
    }
  },
};

module.exports = db;