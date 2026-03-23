const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/advertiser/analytics.controller');

router.get('/overview', ctrl.getOverview);
router.get('/campaigns', ctrl.getCampaignAnalytics);
router.get('/campaigns/:id', ctrl.getCampaignDetail);

module.exports = router;
