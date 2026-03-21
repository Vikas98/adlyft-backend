const express = require('express');
const router = express.Router();
const { getCampaigns, getCampaign, createCampaign, updateCampaign, updateCampaignStatus, deleteCampaign } = require('../controllers/campaign.controller');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', getCampaigns);
router.get('/:id', getCampaign);
router.post('/', createCampaign);
router.put('/:id', updateCampaign);
router.put('/:id/status', updateCampaignStatus);
router.delete('/:id', deleteCampaign);

module.exports = router;
