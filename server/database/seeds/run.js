/**
 * database/seeds/run.js
 *
 * Runs all seed SQL files in order.
 * Seeds are idempotent — safe to run multiple times because
 * every INSERT uses ON CONFLICT DO NOTHING.
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const fs   = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME     || 'lead_management_db',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || '',
  ssl:      process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

async function runSeeds() {
  const client = await pool.connect();

  try {
    console.log('🌱 Starting seed process...');

    const seedsDir = __dirname;
    const sqlFiles = fs
      .readdirSync(seedsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    for (const filename of sqlFiles) {
      const filePath = path.join(seedsDir, filename);
      const sql = fs.readFileSync(filePath, 'utf8');

      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('COMMIT');
        console.log(`✅ Seeded: ${filename}`);
      } catch (err) {
        await client.query('ROLLBACK');
        console.error(`❌ Seed failed: ${filename} — ${err.message}`);
        process.exit(1);
      }
    }

    console.log('\n🎉 Seeding complete.');
  } finally {
    client.release();
    await pool.end();
  }
}

runSeeds().catch(err => {
  console.error('Seed runner failed:', err);
  process.exit(1);
});