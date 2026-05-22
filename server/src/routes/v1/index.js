/**
 * src/routes/v1/index.js
 *
 * Aggregates all v1 routes into a single router.
 * app.js mounts this router at /api/v1.
 *
 * Adding a new resource is one line:
 *   router.use('/customers', require('./customers.routes'));
 */

const { Router }   = require('express');
const leadsRoutes  = require('./leads.routes');

const router = Router();

// Health check — useful for load balancers and deployment verification
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
    version: 'v1',
  });
});

router.use('/leads', leadsRoutes);

module.exports = router;