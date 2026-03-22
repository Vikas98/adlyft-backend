const billingService = require('../services/billing.service');
const createLogger = require('../utils/logger');
const asyncHandler = require('../utils/asyncHandler');

const logger = createLogger('BillingController');

const getBillingOverview = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`, { userId: req.user._id });
  const data = await billingService.getBillingOverview(req.user._id);
  res.json({ success: true, data });
});

const getInvoices = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`, { userId: req.user._id });
  const result = await billingService.getInvoices({ userId: req.user._id, ...req.query });
  res.json({ success: true, ...result });
});

const getInvoice = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`, { invoiceId: req.params.id });
  const invoice = await billingService.getInvoice({ invoiceId: req.params.id, userId: req.user._id });
  res.json({ success: true, data: invoice });
});

module.exports = { getBillingOverview, getInvoices, getInvoice };
