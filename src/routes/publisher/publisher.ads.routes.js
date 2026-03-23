const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/publisher/ads.controller');

router.get('/', ctrl.listAds);
router.get('/:id', ctrl.getAd);

module.exports = router;
