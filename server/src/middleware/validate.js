/**
 * src/middleware/validate.js
 *
 * Request validation middleware factory using Zod.
 *
 * WHY ZOD FOR VALIDATION?
 *   Zod provides:
 *   - Schema definition that doubles as TypeScript types (if you migrate to TS)
 *   - Detailed, field-level error messages out of the box
 *   - Transforms (e.g., .trim() phone numbers, .toLowerCase() source)
 *   - Safe parsing that never throws — returns success/error instead
 *
 * WHY VALIDATE IN MIDDLEWARE vs. IN CONTROLLERS?
 *   Controllers should assume the data is valid and focus on business logic.
 *   If validation lives in controllers, every controller starts with 20 lines
 *   of if (!body.name) return res.status(400)... boilerplate.
 *   Middleware handles the cross-cutting concern cleanly.
 *
 * WHY VALIDATE ON THE BACKEND even if the frontend validates?
 *   Frontend validation is a UX convenience.
 *   Backend validation is a security requirement.
 *   Anyone can send a request directly via curl or Postman, bypassing
 *   the frontend entirely. Your backend must NEVER trust client input.
 *
 * USAGE IN ROUTES:
 *   router.post('/', validate(createLeadSchema), leadsController.create);
 *   // If validation fails, a 400 is returned with field-level errors.
 *   // If it passes, req.body is the Zod-parsed (cleaned) data.
 */

const { ZodError } = require('zod');
const ApiResponse  = require('../utils/ApiResponse');

/**
 * @param {ZodSchema} schema - A Zod schema to validate req.body against
 * @returns Express middleware
 */
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    // Transform Zod's error format into a clean array for the API response.
    // Zod errors look like: [{ path: ['phone'], message: 'Required' }]
    const errors = result.error.errors.map(err => ({
      field:   err.path.join('.') || 'unknown',
      message: err.message,
    }));

    return ApiResponse.error(
      res,
      400,
      'Validation failed. Please check the highlighted fields.',
      errors
    );
  }

  // Replace req.body with the Zod-parsed data.
  // This includes any .transform() or .default() values from the schema.
  // e.g., if the schema trims whitespace, req.body.name is now trimmed.
  req.body = result.data;
  next();
};

module.exports = validate;