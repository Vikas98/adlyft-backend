const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/advertiser/publishers.controller');

router.get('/', ctrl.listPublishers);
router.get('/:id', ctrl.getPublisher);

module.exports = router;
