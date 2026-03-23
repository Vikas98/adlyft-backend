const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/advertiser/campaigns.controller');

router.get('/', ctrl.listCampaigns);
router.post('/', ctrl.createCampaign);
router.get('/:id', ctrl.getCampaign);
router.put('/:id', ctrl.updateCampaign);
router.delete('/:id', ctrl.deleteCampaign);
router.put('/:id/pause', ctrl.pauseCampaign);
router.put('/:id/resume', ctrl.resumeCampaign);

module.exports = router;
