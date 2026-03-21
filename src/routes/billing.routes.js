const express = require('express');
const router = express.Router();
const { getBillingOverview, getInvoices, getInvoice } = require('../controllers/billing.controller');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/overview', getBillingOverview);
router.get('/invoices', getInvoices);
router.get('/invoices/:id', getInvoice);

module.exports = router;
