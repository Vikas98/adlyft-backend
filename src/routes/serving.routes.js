const express = require('express');
const router = express.Router();
const { serveAd, trackImpression, trackClick } = require('../controllers/serving.controller');

router.get('/ad', serveAd);
router.get('/impression/:adId', trackImpression);
router.get('/click/:adId', trackClick);

module.exports = router;
