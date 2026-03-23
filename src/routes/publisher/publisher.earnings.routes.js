const express = require('express');
const router = express.Router();
const { getEarnings } = require('../../controllers/publisher/earnings.controller');

router.get('/', getEarnings);

module.exports = router;
