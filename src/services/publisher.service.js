const Publisher = require('../models/Publisher');
const AdSlot = require('../models/AdSlot');
const AppError = require('../utils/AppError');
const createLogger = require('../utils/logger');

const logger = createLogger('PublisherService');

const getPublishers = async ({ category, search, page = 1, limit = 10, status = 'active' }) => {
  logger.info('Fetching publishers', { category, status, page, limit });
  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { appName: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [publishers, total] = await Promise.all([
    Publisher.find(filter).sort({ dau: -1 }).skip(skip).limit(parseInt(limit)),
    Publisher.countDocuments(filter),
  ]);

  logger.debug('Publishers fetched', { count: publishers.length, total });
  return {
    data: publishers,
    pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
  };
};

const getPublisher = async (publisherId) => {
  logger.debug('Fetching publisher', { publisherId });
  const publisher = await Publisher.findById(publisherId);
  if (!publisher) {
    logger.warn('Publisher not found', { publisherId });
    throw new AppError('Publisher not found', 404);
  }
  const slots = await AdSlot.find({ publisherId });
  logger.debug('Publisher fetched with slots', { publisherId, slots: slots.length });
  return { ...publisher.toObject(), slots };
};

module.exports = { getPublishers, getPublisher };
