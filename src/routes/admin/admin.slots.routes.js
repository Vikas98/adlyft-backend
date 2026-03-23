const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/admin/slots.controller');

router.get('/', ctrl.listSlots);
router.get('/:id', ctrl.getSlot);
router.delete('/:id', ctrl.deleteSlot);

module.exports = router;
