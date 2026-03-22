const invoiceService = require('../services/invoice.service');
const createLogger = require('../utils/logger');
const asyncHandler = require('../utils/asyncHandler');

const logger = createLogger('InvoiceController');

const getInvoices = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`, { userId: req.user._id });
  const result = await invoiceService.getInvoices(req.user._id);
  res.json({ success: true, ...result });
});

const getInvoice = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`, { invoiceId: req.params.id });
  const invoice = await invoiceService.getInvoice(req.params.id, req.user._id);
  res.json({ success: true, data: invoice });
});

const createInvoice = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  const invoice = await invoiceService.createInvoice(req.body);
  logger.info('Responding 201 — invoice created', { invoiceId: invoice._id });
  res.status(201).json({ success: true, data: invoice });
});

const updateInvoice = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`, { invoiceId: req.params.id });
  const invoice = await invoiceService.updateInvoice(req.params.id, req.body);
  res.json({ success: true, data: invoice });
});

const deleteInvoice = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`, { invoiceId: req.params.id });
  await invoiceService.deleteInvoice(req.params.id);
  res.json({ success: true, message: 'Invoice deleted' });
});

module.exports = { getInvoices, getInvoice, createInvoice, updateInvoice, deleteInvoice };
