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

const createPublisher = async (body) => {
  const { name, appName, category, description, website, dau, platform, avgCTR, status, contactEmail } = body;
  const apiKey = require('crypto').randomBytes(32).toString('hex');
  logger.info('Creating publisher', { name, appName });
  const publisher = await Publisher.create({ name, appName, category, description, website, dau, platform, avgCTR, status, contactEmail, apiKey });
  logger.info('Publisher created', { publisherId: publisher._id });
  return publisher;
};

const updatePublisher = async (publisherId, body) => {
  logger.info('Updating publisher', { publisherId });
  const publisher = await Publisher.findByIdAndUpdate(publisherId, body, { new: true, runValidators: true });
  if (!publisher) {
    logger.warn('Publisher not found for update', { publisherId });
    throw new AppError('Publisher not found', 404);
  }
  return publisher;
};

const deletePublisher = async (publisherId) => {
  logger.info('Deleting publisher', { publisherId });
  // Delete related slots first to avoid orphaned records
  await AdSlot.deleteMany({ publisherId });
  const publisher = await Publisher.findByIdAndDelete(publisherId);
  if (!publisher) {
    logger.warn('Publisher not found for deletion', { publisherId });
    throw new AppError('Publisher not found', 404);
  }
  logger.info('Publisher and related slots deleted', { publisherId });
  return publisher;
};

module.exports = { getPublishers, getPublisher, createPublisher, updatePublisher, deletePublisher };
