/**
 * src/utils/ApiError.js
 *
 * Custom error class for application-level errors.
 *
 * WHY A CUSTOM ERROR CLASS?
 *   The default `Error` object has only `message` and `stack`.
 *   When a lead is not found, you need to communicate:
 *     - What happened (message)
 *     - What HTTP status to send (statusCode)
 *     - Whether this is an operational error or a bug (isOperational)
 *
 *   isOperational = true  → "We expected this could happen" (404, 400, 409)
 *   isOperational = false → "This is a bug" (uncaught TypeError, DB crash)
 *
 *   The global error handler uses isOperational to decide:
 *     - Operational errors → send the message to the client (safe)
 *     - Non-operational errors → send a generic "Internal Server Error" (safe)
 *       and log the full error internally (so developers can debug)
 *
 * HOW IT SCALES:
 *   In large companies, this class is extended further:
 *   DatabaseError, ValidationError, AuthError — each with custom
 *   logging behavior, Sentry integration, and alerting rules.
 */

class ApiError extends Error {
  /**
   * @param {number} statusCode  - HTTP status code (400, 404, 409, 500…)
   * @param {string} message     - Human-readable error description
   * @param {Array}  errors      - Optional array of field-level validation errors
   * @param {string} stack       - Optional: pass existing stack trace
   */
  constructor(statusCode, message, errors = [], stack = '') {
    super(message);

    this.statusCode   = statusCode;
    this.message      = message;
    this.errors       = errors;     // field-level errors from Zod validation
    this.isOperational = true;      // always true for explicitly thrown ApiErrors
    this.success      = false;

    // Preserve the original stack trace if provided,
    // otherwise capture from this constructor call.
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// ── Static factory methods ────────────────────────────────────────────────────
// These make throw sites read like English:
//   throw ApiError.notFound('Lead not found')
//   throw ApiError.badRequest('Phone number is required')
//   throw ApiError.conflict('A lead with this phone already exists')

ApiError.badRequest = (message, errors = []) =>
  new ApiError(400, message, errors);

ApiError.notFound = (message = 'Resource not found') =>
  new ApiError(404, message);

ApiError.conflict = (message) =>
  new ApiError(409, message);

ApiError.internal = (message = 'Internal server error') => {
  const err = new ApiError(500, message);
  err.isOperational = false; // triggers generic client message
  return err;
};

module.exports = ApiError;