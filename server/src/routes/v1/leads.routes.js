/**
 * src/routes/v1/leads.routes.js
 *
 * Route definitions for the /api/v1/leads namespace.
 *
 * Each route is a pipeline of middleware functions:
 *   [validate] → [asyncHandler(controller)]
 *
 * WHY /v1/ IN THE URL?
 *   API versioning from day one. When you release breaking changes
 *   (v2), existing clients using /v1/ continue working. You deprecate
 *   v1 with a sunset date. Every production API does this.
 *
 * ROUTE ORDER MATTERS:
 *   Express matches routes top-to-bottom.
 *   GET /leads/stats must come BEFORE GET /leads/:id
 *   Otherwise "stats" is treated as an :id value and the DB query
 *   returns "not found" instead of dashboard stats.
 */

const { Router } = require('express');
const leadsController = require('../../controllers/leads.controller');
const asyncHandler    = require('../../utils/asyncHandler');
const validate        = require('../../middleware/validate');
const {
  createLeadSchema,
  updateStatusSchema,
} = require('../../validators/leads.validator');

const router = Router();

// ── GET /api/v1/leads/stats ───────────────────────────────────────────────────
// MUST be before /:id — see note above about route ordering
router.get(
  '/stats',
  asyncHandler(leadsController.getStats)
);

// ── GET /api/v1/leads ─────────────────────────────────────────────────────────
// Supports query params: ?search=john&status=interested&source=call&page=1&limit=20
router.get(
  '/',
  asyncHandler(leadsController.getAll)
);

// ── GET /api/v1/leads/:id ─────────────────────────────────────────────────────
router.get(
  '/:id',
  asyncHandler(leadsController.getById)
);

// ── POST /api/v1/leads ────────────────────────────────────────────────────────
// validate() runs first — if body is invalid, returns 400 before controller runs
router.post(
  '/',
  validate(createLeadSchema),
  asyncHandler(leadsController.create)
);

// ── PATCH /api/v1/leads/:id/status ───────────────────────────────────────────
// PATCH because we're partially updating (only status)
router.patch(
  '/:id/status',
  validate(updateStatusSchema),
  asyncHandler(leadsController.updateStatus)
);

// ── DELETE /api/v1/leads/:id ──────────────────────────────────────────────────
router.delete(
  '/:id',
  asyncHandler(leadsController.delete)
);

module.exports = router;