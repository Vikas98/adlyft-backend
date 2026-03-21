const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, updateNotifications, getApiKey, regenerateApiKey } = require('../controllers/settings.controller');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/notifications', updateNotifications);
router.get('/api-key', getApiKey);
router.post('/api-key/regenerate', regenerateApiKey);

module.exports = router;
