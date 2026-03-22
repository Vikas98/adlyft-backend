const publisherService = require('../services/publisher.service');
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

module.exports = { getPublishers, getPublisher };
