const billingService = require('../services/billing.service');
const createLogger = require('../utils/logger');

const logger = createLogger('BillingController');

const getBillingOverview = async (req, res, next) => {
  try {
    logger.info(`${req.method} ${req.originalUrl}`, { userId: req.user._id });
    const data = await billingService.getBillingOverview(req.user._id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const getInvoices = async (req, res, next) => {
  try {
    logger.info(`${req.method} ${req.originalUrl}`, { userId: req.user._id });
    const result = await billingService.getInvoices({ userId: req.user._id, ...req.query });
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

const getInvoice = async (req, res, next) => {
  try {
    logger.info(`${req.method} ${req.originalUrl}`, { invoiceId: req.params.id });
    const invoice = await billingService.getInvoice({ invoiceId: req.params.id, userId: req.user._id });
    res.json({ success: true, data: invoice });
  } catch (error) {
    next(error);
  }
};

module.exports = { getBillingOverview, getInvoices, getInvoice };
