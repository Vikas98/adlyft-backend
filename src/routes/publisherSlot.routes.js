const express = require('express');
const router = express.Router();
const { registerSlot } = require('../controllers/adSlot.controller');

router.post('/slots/register', registerSlot);

module.exports = router;
