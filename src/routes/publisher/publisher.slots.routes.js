const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/publisher/slots.controller');

router.get('/', ctrl.listSlots);
router.post('/', ctrl.createSlot);
router.get('/:id', ctrl.getSlot);
router.put('/:id', ctrl.updateSlot);
router.delete('/:id', ctrl.deleteSlot);
router.put('/:id/toggle', ctrl.toggleSlot);

module.exports = router;
