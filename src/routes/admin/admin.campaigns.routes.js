const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/admin/campaigns.controller');

router.get('/', ctrl.listCampaigns);
router.get('/:id', ctrl.getCampaign);

module.exports = router;
