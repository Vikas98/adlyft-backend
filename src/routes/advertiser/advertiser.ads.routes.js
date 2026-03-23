const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/advertiser/ads.controller');

router.get('/', ctrl.listAds);
router.post('/', ctrl.createAd);
router.get('/:id', ctrl.getAd);
router.put('/:id', ctrl.updateAd);
router.delete('/:id', ctrl.deleteAd);

module.exports = router;
