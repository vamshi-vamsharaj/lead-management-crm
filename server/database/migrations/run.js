/**
 * database/migrations/run.js
 *
 * Programmatic migration runner.
 *
 * WHY NOT just run the SQL file manually?
 *   Manual psql commands are error-prone and can't be automated
 *   in CI/CD pipelines or Docker entrypoints. This script lets
 *   you run `npm run migrate` reliably in any environment.
 *
 * HOW IT WORKS:
 *   1. Creates a `schema_migrations` table if it doesn't exist.
 *      This table tracks which migration files have already run.
 *   2. Reads all .sql files from this directory, sorted by name.
 *   3. Skips files that have already been recorded in the table.
 *   4. Runs each pending migration inside a transaction.
 *      If any SQL statement fails, the transaction rolls back —
 *      your database is never left in a half-migrated state.
 *   5. Records the filename in schema_migrations on success.
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const fs   = require('fs');
const path = require('path');
const { Pool } = require('pg');

// ── Database connection ───────────────────────────────────────────────────────
const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME     || 'lead_management_db',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || '',
  ssl:      process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

// ── Migration runner ──────────────────────────────────────────────────────────
async function runMigrations() {
  const client = await pool.connect();

  try {
    console.log('🔌 Connected to PostgreSQL');

    // Step 1: Create the migrations tracking table if it doesn't exist.
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id         SERIAL PRIMARY KEY,
        filename   VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // Step 2: Find all SQL migration files, sorted alphabetically.
    //   Alphabetical sort on "001_", "002_", "003_" naming gives
    //   correct execution order.
    const migrationsDir = __dirname;
    const sqlFiles = fs
      .readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    if (sqlFiles.length === 0) {
      console.log('ℹ️  No migration files found.');
      return;
    }

    // Step 3: Check which migrations have already been applied.
    const { rows: applied } = await client.query(
      'SELECT filename FROM schema_migrations'
    );
    const appliedSet = new Set(applied.map(r => r.filename));

    // Step 4: Run pending migrations.
    let ranCount = 0;
    for (const filename of sqlFiles) {
      if (appliedSet.has(filename)) {
        console.log(`⏭️  Skipping (already applied): ${filename}`);
        continue;
      }

      const filePath = path.join(migrationsDir, filename);
      const sql = fs.readFileSync(filePath, 'utf8');

      // Run inside a transaction — all-or-nothing.
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query(
          'INSERT INTO schema_migrations (filename) VALUES ($1)',
          [filename]
        );
        await client.query('COMMIT');
        console.log(`✅ Applied: ${filename}`);
        ranCount++;
      } catch (err) {
        await client.query('ROLLBACK');
        console.error(`❌ Failed: ${filename}`);
        console.error(err.message);
        process.exit(1); // Stop immediately — don't run subsequent migrations on a broken state
      }
    }

    if (ranCount === 0) {
      console.log('✅ Database is already up to date.');
    } else {
      console.log(`\n🎉 Migration complete. ${ranCount} file(s) applied.`);
    }

  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations().catch(err => {
  console.error('Migration runner failed:', err);
  process.exit(1);
});