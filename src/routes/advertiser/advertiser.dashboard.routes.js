const express = require('express');
const router = express.Router();
const { getStats } = require('../../controllers/advertiser/dashboard.controller');

router.get('/stats', getStats);

module.exports = router;
