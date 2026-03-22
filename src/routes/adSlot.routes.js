const express = require('express');
const router = express.Router();
const { getSlots, getSlot, createSlot, updateSlot, deleteSlot } = require('../controllers/adSlot.controller');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);
router.get('/', getSlots);
router.get('/:id', getSlot);
router.post('/', adminOnly, createSlot);
router.put('/:id', adminOnly, updateSlot);
router.delete('/:id', adminOnly, deleteSlot);

module.exports = router;
