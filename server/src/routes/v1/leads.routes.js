
const { Router } = require('express');
const leadsController = require('../../controllers/leads.controller');
const asyncHandler    = require('../../utils/asyncHandler');
const validate        = require('../../middleware/validate');
const {
  createLeadSchema,
  updateStatusSchema,
} = require('../../validators/leads.validator');

const router = Router();

router.get(
  '/stats',
  asyncHandler(leadsController.getStats)
);

router.get(
  '/',
  asyncHandler(leadsController.getAll)
);

// ── GET /api/v1/leads/:id ─────────────────────────────────────────────────────
router.get(
  '/:id',
  asyncHandler(leadsController.getById)
);

router.post(
  '/',
  validate(createLeadSchema),
  asyncHandler(leadsController.create)
);

router.patch(
  '/:id/status',
  validate(updateStatusSchema),
  asyncHandler(leadsController.updateStatus)
);

router.delete(
  '/:id',
  asyncHandler(leadsController.delete)
);

module.exports = router;