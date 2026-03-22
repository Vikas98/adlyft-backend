const express = require('express');
const router = express.Router();
const { getPublishers, getPublisher, createPublisher, updatePublisher, deletePublisher } = require('../controllers/publisher.controller');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);
router.get('/', getPublishers);
router.get('/:id', getPublisher);
router.post('/', adminOnly, createPublisher);
router.put('/:id', adminOnly, updatePublisher);
router.delete('/:id', adminOnly, deletePublisher);

module.exports = router;
