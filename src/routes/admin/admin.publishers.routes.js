const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/admin/publishers.controller');

router.get('/', ctrl.listPublishers);
router.get('/:id', ctrl.getPublisher);
router.put('/:id/approve', ctrl.approvePublisher);
router.put('/:id/reject', ctrl.rejectPublisher);
router.put('/:id/block', ctrl.blockPublisher);
router.delete('/:id', ctrl.deletePublisher);

module.exports = router;
