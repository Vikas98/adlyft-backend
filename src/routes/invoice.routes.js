const express = require('express');
const router = express.Router();
const { getInvoices, getInvoice, createInvoice, updateInvoice, deleteInvoice } = require('../controllers/invoice.controller');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);
router.get('/', getInvoices);
router.get('/:id', getInvoice);
router.post('/', adminOnly, createInvoice);
router.put('/:id', adminOnly, updateInvoice);
router.delete('/:id', adminOnly, deleteInvoice);

module.exports = router;
