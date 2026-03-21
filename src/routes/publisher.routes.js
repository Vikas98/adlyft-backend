const express = require('express');
const router = express.Router();
const { getPublishers, getPublisher } = require('../controllers/publisher.controller');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', getPublishers);
router.get('/:id', getPublisher);

module.exports = router;
