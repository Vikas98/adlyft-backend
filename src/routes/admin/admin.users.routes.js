const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/admin/users.controller');

router.get('/', ctrl.listUsers);
router.put('/:id/block', ctrl.blockUser);
router.put('/:id/unblock', ctrl.unblockUser);

module.exports = router;
