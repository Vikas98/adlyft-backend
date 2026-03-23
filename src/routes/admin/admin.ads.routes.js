const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/admin/ads.controller');

router.get('/', ctrl.listAds);
router.get('/:id', ctrl.getAd);
router.put('/:id/approve', ctrl.approveAd);
router.put('/:id/reject', ctrl.rejectAd);

module.exports = router;
