
const ApiError   = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const config     = require('../config/env');

// ── PostgreSQL error codes ────────────────────────────────────────────────────
// Map pg error codes to friendly ApiErrors before they reach the client.
const PG_ERROR_CODES = {
  '23505': handleUniqueViolation,   // unique_violation
  '23503': handleForeignKeyViolation, // foreign_key_violation
  '22P02': handleInvalidInput,      // invalid_input_syntax (bad UUID format)
  '23502': handleNotNullViolation,  // not_null_violation
};

function handleUniqueViolation(err) {
  // The detail message looks like: Key (phone)=(+91-9999999999) already exists.
  const match = err.detail?.match(/Key \((.+?)\)=\((.+?)\) already exists/);
  if (match) {
    return new ApiError(409, `A lead with this ${match[1]} already exists.`);
  }
  return new ApiError(409, 'Duplicate entry — this record already exists.');
}

function handleForeignKeyViolation() {
  return new ApiError(409, 'Operation violates a data relationship constraint.');
}

function handleInvalidInput(err) {
  return new ApiError(400, `Invalid format: ${err.message}`);
}

function handleNotNullViolation(err) {
  return new ApiError(400, `Required field missing: ${err.column}`);
}

// ── Main error handler ────────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {

  // ── 1. Translate PostgreSQL errors to ApiErrors ───────────────────────────
  if (err.code && PG_ERROR_CODES[err.code]) {
    err = PG_ERROR_CODES[err.code](err);
  }

  // ── 2. Determine response details ─────────────────────────────────────────
  const statusCode = err.statusCode || 500;
  const isOperational = err.isOperational === true;

  // ── 3. Log the error ──────────────────────────────────────────────────────
  if (statusCode >= 500) {
    // Bugs and unexpected errors — log full detail for developers
    console.error('\n🔴 UNHANDLED ERROR ─────────────────────────────────');
    console.error(`  Time:    ${new Date().toISOString()}`);
    console.error(`  Route:   ${req.method} ${req.originalUrl}`);
    console.error(`  Status:  ${statusCode}`);
    console.error(`  Message: ${err.message}`);
    if (config.isDev) {
      console.error(`  Stack:   ${err.stack}`);
    }
    console.error('────────────────────────────────────────────────────\n');
  } else if (config.isDev) {
    // Operational errors (4xx) — log briefly in dev, skip in prod
    console.warn(`⚠️  ${req.method} ${req.originalUrl} → ${statusCode}: ${err.message}`);
  }

  // ── 4. Send response ──────────────────────────────────────────────────────
  const clientMessage = isOperational
    ? err.message  // Safe to show: we wrote this message intentionally
    : config.isProd
      ? 'Something went wrong. Please try again later.' // Hide bug details in production
      : err.message; // Show in development for easier debugging

  return ApiResponse.error(
    res,
    statusCode,
    clientMessage,
    err.errors || []
  );
};

module.exports = errorHandler;