
const app = require('./app');
const config = require('./config/env');
const db = require('./config/db');


const PORT = config.PORT;

async function startServer() {
  try {
    await db.testConnection();

    const server = app.listen(PORT, () => {
      console.log('\n🚀 Lead Management API is running');
      console.log(`   Environment: ${config.NODE_ENV}`);
      console.log(`   Port:        ${PORT}`);
      console.log(`   Base URL:    http://localhost:${PORT}/api/v1`);
      console.log(`   Health:      http://localhost:${PORT}/api/v1/health\n`);
    });

    const gracefulShutdown = (signal) => {
      console.log(`\n⚠️  ${signal} received. Starting graceful shutdown...`);

      server.close(() => {
        console.log('✅ HTTP server closed. No more incoming requests.');

        process.exit(0);
      });


      setTimeout(() => {
        console.error('❌ Forced shutdown after 10s timeout.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT',  () => gracefulShutdown('SIGINT'));  // Ctrl+C

    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Promise Rejection:', reason);
      console.error('   Promise:', promise);
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