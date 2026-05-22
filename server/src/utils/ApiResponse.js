
const ApiResponse = {
  /**
   * Send a successful response.
   *
   * @param {Response} res
   * @param {number}   statusCode  - 200, 201, etc.
   * @param {*}        data        - The payload (object, array, or null)
   * @param {string}   message     - Human-readable success description
   */
  success(res, statusCode, data, message = 'Success') {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  },

  /**
   * Send an error response.
   *
   * @param {Response} res
   * @param {number}   statusCode  - 400, 404, 409, 500, etc.
   * @param {string}   message     - Human-readable error description
   * @param {Array}    errors      - Optional field-level validation errors
   */
  error(res, statusCode, message, errors = []) {
    const body = {
      success: false,
      message,
    };
    if (errors.length > 0) {
      body.errors = errors;
    }
    return res.status(statusCode).json(body);
  },
};

module.exports = ApiResponse;