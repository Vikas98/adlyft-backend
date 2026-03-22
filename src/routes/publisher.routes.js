const express = require('express');
const router = express.Router();
const { getPublishers, getPublisher, createPublisher, updatePublisher, deletePublisher } = require('../controllers/publisher.controller');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', getPublishers);
router.get('/:id', getPublisher);
router.post('/', createPublisher);
router.put('/:id', updatePublisher);
router.delete('/:id', deletePublisher);

module.exports = router;
