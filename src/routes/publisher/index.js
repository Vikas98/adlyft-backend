const express = require('express');
const router = express.Router();

router.use('/dashboard', require('./publisher.dashboard.routes'));
router.use('/slots', require('./publisher.slots.routes'));
router.use('/ads', require('./publisher.ads.routes'));
router.use('/analytics', require('./publisher.analytics.routes'));
router.use('/earnings', require('./publisher.earnings.routes'));

module.exports = router;
