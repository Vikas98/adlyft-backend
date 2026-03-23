const express = require('express');
const router = express.Router();

router.use('/dashboard', require('./advertiser.dashboard.routes'));
router.use('/campaigns', require('./advertiser.campaigns.routes'));
router.use('/ads', require('./advertiser.ads.routes'));
router.use('/publishers', require('./advertiser.publishers.routes'));
router.use('/analytics', require('./advertiser.analytics.routes'));
router.use('/billing', require('./advertiser.billing.routes'));

module.exports = router;
