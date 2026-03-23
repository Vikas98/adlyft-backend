const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/advertiser/billing.controller');

router.get('/summary', ctrl.getBillingSummary);
router.get('/invoices', ctrl.listInvoices);
router.get('/invoices/:id', ctrl.getInvoice);

module.exports = router;
