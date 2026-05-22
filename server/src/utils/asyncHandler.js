/**
 * src/utils/asyncHandler.js
 *
 * Higher-order function that wraps async route handlers.
 *
 * WHY THIS EXISTS:
 *   Express does not natively catch errors thrown inside async functions.
 *   Without this wrapper, every async controller must repeat:
 *
 *     async (req, res, next) => {
 *       try {
 *         // ... logic
 *       } catch (err) {
 *         next(err); // must manually pass to error middleware
 *       }
 *     }
 *
 *   That's 4 lines of boilerplate on every function, forever.
 *   More critically, developers forget it — leading to unhandled
 *   promise rejections that crash the Node.js process.
 *
 *   asyncHandler wraps any async function and automatically catches
 *   rejected promises, forwarding them to Express's error middleware.
 *
 * USAGE:
 *   router.get('/', asyncHandler(leadsController.getAll));
 *   // If getAll throws or rejects, the error is caught and next(err) is called.
 *
 * HOW IT WORKS:
 *   asyncHandler(fn) returns a new function.
 *   When Express calls that function, it executes fn(req, res, next).
 *   Promise.resolve() wraps it in case fn isn't actually async.
 *   .catch(next) forwards any rejection to Express's error handler.
 */

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;