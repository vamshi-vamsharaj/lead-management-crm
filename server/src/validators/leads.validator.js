/**
 * src/validators/leads.validator.js
 *
 * Zod schemas for all lead-related API endpoints.
 *
 * WHY ZOD SCHEMAS ARE DEFINED HERE (NOT INLINE IN ROUTES)?
 *   Centralized schemas are:
 *   - Reusable (same schema can be used in tests, docs generation, etc.)
 *   - Readable (route files stay clean — just method + middleware + handler)
 *   - Maintainable (one place to update validation rules)
 *
 * SCHEMA DESIGN PRINCIPLES:
 *   - Use .trim() on all string inputs — prevent "  John  " from being stored
 *   - Use .min(1) on required strings — prevent empty string "" from passing
 *   - Use .transform() to normalize data (lowercase, strip dashes)
 *   - Keep enum values in sync with PostgreSQL enums AND constants.js
 */

const { z } = require('zod');
const { LEAD_SOURCE, LEAD_STATUS } = require('../utils/constants');

// ── Reusable field definitions ────────────────────────────────────────────────

const nameField = z
  .string({ required_error: 'Name is required' })
  .trim()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name cannot exceed 100 characters');

const phoneField = z
  .string({ required_error: 'Phone number is required' })
  .trim()
  .min(7, 'Phone number is too short')
  .max(20, 'Phone number is too long')
  // Allow digits, +, -, spaces, parentheses
  .regex(
    /^[+\d\s\-().]+$/,
    'Phone number contains invalid characters. Use digits, +, -, spaces, or parentheses only.'
  );

const sourceField = z.enum(
  [LEAD_SOURCE.CALL, LEAD_SOURCE.WHATSAPP, LEAD_SOURCE.FIELD],
  {
    required_error: 'Source is required',
    invalid_type_error: `Source must be one of: ${Object.values(LEAD_SOURCE).join(', ')}`,
  }
);

const notesField = z
  .string()
  .trim()
  .max(1000, 'Notes cannot exceed 1000 characters')
  .optional()
  .nullable();

// ── Exported schemas ──────────────────────────────────────────────────────────

/**
 * POST /api/v1/leads
 * Creates a new lead.
 */
const createLeadSchema = z.object({
  name:   nameField,
  phone:  phoneField,
  source: sourceField,
  notes:  notesField,
});

/**
 * PATCH /api/v1/leads/:id/status
 * Updates only the status field of a lead.
 *
 * WHY PATCH FOR STATUS UPDATE?
 *   PATCH = partial update (only the fields you send are changed).
 *   PUT   = full replacement (you must send ALL fields).
 *   Status updates only touch the status column — PATCH is semantically correct.
 */
const updateStatusSchema = z.object({
  status: z.enum(
    [
      LEAD_STATUS.NEW,
      LEAD_STATUS.INTERESTED,
      LEAD_STATUS.NOT_INTERESTED,
      LEAD_STATUS.CONVERTED,
    ],
    {
      required_error: 'Status is required',
      invalid_type_error: `Status must be one of: ${Object.values(LEAD_STATUS).join(', ')}`,
    }
  ),
});

/**
 * GET /api/v1/leads (query parameter validation)
 * Validates optional search and filter query params.
 *
 * WHY VALIDATE QUERY PARAMS?
 *   `?limit=DROP TABLE leads` is a real attack vector.
 *   Always validate and coerce query params before using them in SQL.
 */
const getLeadsQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  status: z
    .enum([
      LEAD_STATUS.NEW,
      LEAD_STATUS.INTERESTED,
      LEAD_STATUS.NOT_INTERESTED,
      LEAD_STATUS.CONVERTED,
    ])
    .optional(),
  source: z
    .enum([LEAD_SOURCE.CALL, LEAD_SOURCE.WHATSAPP, LEAD_SOURCE.FIELD])
    .optional(),
  page:  z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

module.exports = {
  createLeadSchema,
  updateStatusSchema,
  getLeadsQuerySchema,
};