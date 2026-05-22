
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

  req.body = result.data;
  next();
};

module.exports = validate;