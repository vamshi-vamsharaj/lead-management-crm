/**
 * src/utils/constants.js
 *
 * Application-wide constants.
 *
 * WHY CONSTANTS INSTEAD OF MAGIC STRINGS?
 *   Writing 'interested' in 10 different files means:
 *   - A typo ('intersted') silently produces wrong behavior
 *   - Renaming it requires a project-wide find-and-replace
 *   - A code reviewer can't know if 'interested' in file A
 *     refers to the same concept as 'interested' in file B
 *
 *   LEAD_STATUS.INTERESTED is unambiguous, typo-safe (IDE catches it),
 *   and refactorable in one place.
 */

// ── Mirrors PostgreSQL enum: lead_source ──────────────────────────────────────
const LEAD_SOURCE = Object.freeze({
  CALL:      'call',
  WHATSAPP:  'whatsapp',
  FIELD:     'field',
});

// ── Mirrors PostgreSQL enum: lead_status ─────────────────────────────────────
const LEAD_STATUS = Object.freeze({
  NEW:           'new',
  INTERESTED:    'interested',
  NOT_INTERESTED: 'not_interested',
  CONVERTED:     'converted',
});

// ── HTTP status codes — avoid magic numbers in controllers ───────────────────
const HTTP = Object.freeze({
  OK:         200,
  CREATED:    201,
  NO_CONTENT: 204,
  BAD_REQUEST:  400,
  NOT_FOUND:    404,
  CONFLICT:     409,
  UNPROCESSABLE: 422,
  INTERNAL:     500,
});

// ── Pagination defaults ───────────────────────────────────────────────────────
const PAGINATION = Object.freeze({
  DEFAULT_PAGE:  1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT:     100,
});

module.exports = { LEAD_SOURCE, LEAD_STATUS, HTTP, PAGINATION };