const express = require('express');
const router = express.Router();
const { getOverview, getTimeSeries, getPublisherAnalytics, getCampaignAnalytics } = require('../controllers/analytics.controller');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/overview', getOverview);
router.get('/timeseries', getTimeSeries);
router.get('/publishers', getPublisherAnalytics);
router.get('/campaigns', getCampaignAnalytics);

module.exports = router;
