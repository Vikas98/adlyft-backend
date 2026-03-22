const Invoice = require('../models/Invoice');
const AppError = require('../utils/AppError');
const createLogger = require('../utils/logger');

const logger = createLogger('InvoiceService');

const getInvoices = async (userId) => {
  logger.debug('Fetching invoices', { userId });
  const invoices = await Invoice.find({ advertiserId: userId }).sort({ createdAt: -1 });
  return { data: invoices, total: invoices.length };
};

const getInvoice = async (invoiceId, userId) => {
  logger.debug('Fetching invoice', { invoiceId, userId });
  const invoice = await Invoice.findOne({ _id: invoiceId, advertiserId: userId });
  if (!invoice) {
    logger.warn('Invoice not found', { invoiceId, userId });
    throw new AppError('Invoice not found', 404);
  }
  return invoice;
};

const createInvoice = async (body) => {
  logger.info('Creating invoice');
  const invoice = await Invoice.create(body);
  logger.info('Invoice created', { invoiceId: invoice._id });
  return invoice;
};

const updateInvoice = async (invoiceId, body) => {
  logger.info('Updating invoice', { invoiceId });
  const invoice = await Invoice.findByIdAndUpdate(invoiceId, body, { new: true, runValidators: true });
  if (!invoice) {
    logger.warn('Invoice not found for update', { invoiceId });
    throw new AppError('Invoice not found', 404);
  }
  return invoice;
};

const deleteInvoice = async (invoiceId) => {
  logger.info('Deleting invoice', { invoiceId });
  const invoice = await Invoice.findByIdAndDelete(invoiceId);
  if (!invoice) {
    logger.warn('Invoice not found for deletion', { invoiceId });
    throw new AppError('Invoice not found', 404);
  }
  return invoice;
};

module.exports = { getInvoices, getInvoice, createInvoice, updateInvoice, deleteInvoice };
