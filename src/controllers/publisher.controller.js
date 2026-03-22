const publisherService = require('../services/publisher.service');
const Publisher = require('../models/Publisher');
const createLogger = require('../utils/logger');
const asyncHandler = require('../utils/asyncHandler');

const logger = createLogger('PublisherController');

const getPublishers = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  const result = await publisherService.getPublishers(req.query);
  res.json({ success: true, ...result });
});

const getPublisher = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`, { publisherId: req.params.id });
  const publisher = await publisherService.getPublisher(req.params.id);
  res.json({ success: true, data: publisher });
});

const createPublisher = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  const publisher = await publisherService.createPublisher(req.body);
  logger.info('Responding 201 — publisher created', { publisherId: publisher._id });
  res.status(201).json({ success: true, data: publisher });
});

const updatePublisher = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`, { publisherId: req.params.id });
  const publisher = await publisherService.updatePublisher(req.params.id, req.body);
  res.json({ success: true, data: publisher });
});

const deletePublisher = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`, { publisherId: req.params.id });
  await publisherService.deletePublisher(req.params.id);
  res.json({ success: true, message: 'Publisher deleted' });
});

module.exports = { getPublishers, getPublisher, createPublisher, updatePublisher, deletePublisher };
