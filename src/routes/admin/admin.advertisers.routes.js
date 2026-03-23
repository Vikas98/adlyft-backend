const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/admin/advertisers.controller');

router.get('/', ctrl.listAdvertisers);
router.get('/:id', ctrl.getAdvertiser);
router.put('/:id/block', ctrl.blockAdvertiser);
router.delete('/:id', ctrl.deleteAdvertiser);

module.exports = router;
