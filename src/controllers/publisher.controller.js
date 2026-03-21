const publisherService = require('../services/publisher.service');
const createLogger = require('../utils/logger');

const logger = createLogger('PublisherController');

const getPublishers = async (req, res, next) => {
  try {
    logger.info(`${req.method} ${req.originalUrl}`);
    const result = await publisherService.getPublishers(req.query);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

const getPublisher = async (req, res, next) => {
  try {
    logger.info(`${req.method} ${req.originalUrl}`, { publisherId: req.params.id });
    const publisher = await publisherService.getPublisher(req.params.id);
    res.json({ success: true, data: publisher });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPublishers, getPublisher };
