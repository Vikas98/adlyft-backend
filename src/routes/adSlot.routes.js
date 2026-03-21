const express = require('express');
const router = express.Router();
const { getSlots, getSlot } = require('../controllers/adSlot.controller');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', getSlots);
router.get('/:id', getSlot);

module.exports = router;
