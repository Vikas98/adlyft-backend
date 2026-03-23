const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/publisher/analytics.controller');

router.get('/overview', ctrl.getOverview);
router.get('/slots', ctrl.getSlotAnalytics);
router.get('/slots/:id', ctrl.getSlotDetail);

module.exports = router;
