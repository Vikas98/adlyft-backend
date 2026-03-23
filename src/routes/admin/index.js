const express = require('express');
const router = express.Router();

router.use('/dashboard', require('./admin.dashboard.routes'));
router.use('/publishers', require('./admin.publishers.routes'));
router.use('/advertisers', require('./admin.advertisers.routes'));
router.use('/ads', require('./admin.ads.routes'));
router.use('/slots', require('./admin.slots.routes'));
router.use('/campaigns', require('./admin.campaigns.routes'));
router.use('/users', require('./admin.users.routes'));
router.use('/analytics', require('./admin.analytics.routes'));

module.exports = router;
