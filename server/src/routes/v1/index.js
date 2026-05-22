
const { Router }   = require('express');
const leadsRoutes  = require('./leads.routes');

const router = Router();

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