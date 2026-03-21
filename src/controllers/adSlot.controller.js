const adSlotService = require('../services/adSlot.service');
const createLogger = require('../utils/logger');

const logger = createLogger('AdSlotController');

const getSlots = async (req, res, next) => {
  try {
    logger.info(`${req.method} ${req.originalUrl}`);
    const result = await adSlotService.getSlots(req.query);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

const getSlot = async (req, res, next) => {
  try {
    logger.info(`${req.method} ${req.originalUrl}`, { slotId: req.params.id });
    const slot = await adSlotService.getSlot(req.params.id);
    res.json({ success: true, data: slot });
  } catch (error) {
    next(error);
  }
};

const registerSlot = async (req, res, next) => {
  try {
    logger.info(`${req.method} ${req.originalUrl}`);
    const slot = await adSlotService.registerSlot({ apiKey: req.headers['x-api-key'], body: req.body });
    logger.info('Responding 201 — slot registered', { slotId: slot.slotId });
    res.status(201).json({ success: true, data: slot });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSlots, getSlot, registerSlot };
