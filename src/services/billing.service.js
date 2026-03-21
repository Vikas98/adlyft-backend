const Invoice = require('../models/Invoice');
const Campaign = require('../models/Campaign');
const createLogger = require('../utils/logger');

const logger = createLogger('BillingService');

const getBillingOverview = async (userId) => {
  logger.info('Fetching billing overview', { userId });
  const campaigns = await Campaign.find({ advertiserId: userId });
  const totalSpent = campaigns.reduce((sum, c) => sum + c.totalSpend, 0);

  const invoices = await Invoice.find({ advertiserId: userId });
  const pendingInvoices = invoices.filter(i => i.status === 'pending');
  const nextInvoice = pendingInvoices.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0];

  logger.debug('Billing overview computed', { userId, totalSpent, pendingCount: pendingInvoices.length });
  return {
    totalSpent,
    currentBalance: pendingInvoices.reduce((sum, i) => sum + i.amount, 0),
    nextInvoiceDate: nextInvoice ? nextInvoice.dueDate : null,
    paidInvoices: invoices.filter(i => i.status === 'paid').length,
    pendingInvoices: pendingInvoices.length,
  };
};

const getInvoices = async ({ userId, page = 1, limit = 10, status }) => {
  logger.info('Fetching invoices', { userId, page, limit, status });
  const filter = { advertiserId: userId };
  if (status) filter.status = status;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [invoices, total] = await Promise.all([
    Invoice.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
    Invoice.countDocuments(filter),
  ]);

  logger.debug('Invoices fetched', { userId, count: invoices.length, total });
  return {
    data: invoices,
    pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
  };
};

const getInvoice = async ({ invoiceId, userId }) => {
  logger.debug('Fetching invoice', { invoiceId, userId });
  const invoice = await Invoice.findOne({ _id: invoiceId, advertiserId: userId });
  if (!invoice) {
    logger.warn('Invoice not found', { invoiceId, userId });
    const err = new Error('Invoice not found');
    err.statusCode = 404;
    throw err;
  }
  return invoice;
};

module.exports = { getBillingOverview, getInvoices, getInvoice };
