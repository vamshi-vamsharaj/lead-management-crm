/**
 * server.js
 *
 * Application entry point.
 * Responsibilities:
 *   1. Load environment variables
 *   2. Test database connectivity (fail fast if DB is unreachable)
 *   3. Start the HTTP server
 *   4. Handle graceful shutdown on SIGTERM/SIGINT
 *
 * WHY GRACEFUL SHUTDOWN?
 *   When a process receives SIGTERM (e.g., from Docker, Kubernetes, Heroku
 *   during a deploy), it should:
 *   1. Stop accepting new requests
 *   2. Finish processing in-flight requests
 *   3. Close database connections cleanly
 *   4. Exit
 *
 *   Without this, mid-flight requests are killed instantly, causing
 *   client errors and potentially partial database writes.
 */

const app = require('./app');
const config = require('./config/env');
const db = require('./config/db');


const PORT = config.PORT;

async function startServer() {
  try {
    // ── Step 1: Verify database connection before starting HTTP server ────
    // If the database is unreachable, there's no point starting.
    // "Fail fast" gives a clear error at boot, not a mysterious 500 in production.
    await db.testConnection();

    // ── Step 2: Start HTTP server ─────────────────────────────────────────
    const server = app.listen(PORT, () => {
      console.log('\n🚀 Lead Management API is running');
      console.log(`   Environment: ${config.NODE_ENV}`);
      console.log(`   Port:        ${PORT}`);
      console.log(`   Base URL:    http://localhost:${PORT}/api/v1`);
      console.log(`   Health:      http://localhost:${PORT}/api/v1/health\n`);
    });

    // ── Step 3: Graceful shutdown handler ─────────────────────────────────
    const gracefulShutdown = (signal) => {
      console.log(`\n⚠️  ${signal} received. Starting graceful shutdown...`);

      server.close(() => {
        console.log('✅ HTTP server closed. No more incoming requests.');
        // pg pool closes all connections
        process.exit(0);
      });

      // Force shutdown after 10 seconds if graceful close hangs
      setTimeout(() => {
        console.error('❌ Forced shutdown after 10s timeout.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT',  () => gracefulShutdown('SIGINT'));  // Ctrl+C

    // ── Step 4: Handle uncaught errors ────────────────────────────────────
    // These are bugs — log, then exit so the process manager can restart cleanly
    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Promise Rejection:', reason);
      console.error('   Promise:', promise);
      // In production, exit and let the process manager restart
      if (config.isProd) process.exit(1);
    });

    process.on('uncaughtException', (err) => {
      console.error('❌ Uncaught Exception:', err);
      process.exit(1); // Always exit on uncaught exceptions
    });

  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
}

startServer();