const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/admin/analytics.controller');

router.get('/overview', ctrl.getOverview);
router.get('/publishers', ctrl.getPublisherAnalytics);
router.get('/advertisers', ctrl.getAdvertiserAnalytics);

module.exports = router;
