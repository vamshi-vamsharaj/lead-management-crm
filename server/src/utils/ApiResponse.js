/**
 * src/utils/ApiResponse.js
 *
 * Standardized response envelope for ALL API responses.
 *
 * WHY A CONSISTENT RESPONSE ENVELOPE?
 *   Without this, different developers write different response shapes:
 *     res.json({ leads: [...] })          // route A
 *     res.json({ data: { leads: [...] }}) // route B
 *     res.json([...])                     // route C
 *
 *   Frontend developers then write defensive code:
 *     const data = response.leads || response.data?.leads || response
 *
 *   A consistent envelope means frontend code is predictable:
 *     response.data    → always the payload
 *     response.success → always a boolean
 *     response.message → always a human-readable string
 *
 *   This is what every professional API (Stripe, Twilio, GitHub) does.
 *
 * USAGE IN CONTROLLERS:
 *   return ApiResponse.success(res, 201, lead, 'Lead created successfully');
 *   return ApiResponse.error(res, 404, 'Lead not found');
 */

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