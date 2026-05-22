/**
 * src/middleware/notFound.js
 *
 * Handles requests to routes that don't exist.
 *
 * WHY THIS MATTERS:
 *   Without this, Express returns its default HTML "Cannot GET /api/v1/unknown"
 *   response — which breaks the JSON-only contract of an API.
 *   Register this AFTER all routes but BEFORE the error handler.
 */

const ApiError = require('../utils/ApiError');

const notFound = (req, res, next) => {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
};

module.exports = notFound;