const AdSlot = require('../models/AdSlot');
const Publisher = require('../models/Publisher');
const AppError = require('../utils/AppError');
const { v4: uuidv4 } = require('uuid');
const createLogger = require('../utils/logger');

const logger = createLogger('AdSlotService');

const getSlots = async ({ publisherId, type, status, page = 1, limit = 20 }) => {
  logger.debug('Fetching ad slots', { publisherId, type, status, page, limit });
  const filter = {};
  if (publisherId) filter.publisherId = publisherId;
  if (type) filter.type = type;
  if (status) filter.status = status;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [slots, total] = await Promise.all([
    AdSlot.find(filter).populate('publisherId', 'name appName').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
    AdSlot.countDocuments(filter),
  ]);

  logger.debug('Ad slots fetched', { count: slots.length, total });
  return {
    data: slots,
    pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
  };
};

const getSlot = async (slotId) => {
  logger.debug('Fetching ad slot', { slotId });
  const slot = await AdSlot.findById(slotId).populate('publisherId', 'name appName category');
  if (!slot) {
    logger.warn('Ad slot not found', { slotId });
    throw new AppError('Ad slot not found', 404);
  }
  return slot;
};

const registerSlot = async ({ apiKey, body }) => {
  logger.info('Registering new ad slot');
  if (!apiKey) {
    throw new AppError('Publisher API key required', 401);
  }

  const publisher = await Publisher.findOne({ apiKey });
  if (!publisher) {
    logger.warn('Slot registration failed — invalid API key');
    throw new AppError('Invalid publisher API key', 401);
  }

  const { name, screen, size, type, pricePerMonth, cpm } = body;
  const slotId = `${publisher.appName.toLowerCase().replace(/\s+/g, '_')}_${screen}_${type}_${uuidv4().slice(0, 8)}`;

  const slot = await AdSlot.create({
    publisherId: publisher._id,
    slotId,
    name,
    screen: screen || '',
    size: size || '320x50',
    type,
    pricePerMonth: pricePerMonth || 0,
    cpm: cpm || 0,
  });

  logger.info('Ad slot registered successfully', { slotId: slot.slotId, publisherId: publisher._id });
  return slot;
};

module.exports = { getSlots, getSlot, registerSlot };
