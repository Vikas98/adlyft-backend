const adSlotService = require('../services/adSlot.service');
const createLogger = require('../utils/logger');
const asyncHandler = require('../utils/asyncHandler');

const logger = createLogger('AdSlotController');

const getSlots = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  const result = await adSlotService.getSlots(req.query);
  res.json({ success: true, ...result });
});

const getSlot = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`, { slotId: req.params.id });
  const slot = await adSlotService.getSlot(req.params.id);
  res.json({ success: true, data: slot });
});

const registerSlot = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  const slot = await adSlotService.registerSlot({ apiKey: req.headers['x-api-key'], body: req.body });
  logger.info('Responding 201 — slot registered', { slotId: slot.slotId });
  res.status(201).json({ success: true, data: slot });
});

const createSlot = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  const slot = await adSlotService.createSlot(req.body);
  logger.info('Responding 201 — slot created', { slotId: slot.slotId });
  res.status(201).json({ success: true, data: slot });
});

const updateSlot = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`, { slotId: req.params.id });
  const slot = await adSlotService.updateSlot(req.params.id, req.body);
  res.json({ success: true, data: slot });
});

const deleteSlot = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`, { slotId: req.params.id });
  await adSlotService.deleteSlot(req.params.id);
  res.json({ success: true, message: 'Ad slot deleted' });
});

module.exports = { getSlots, getSlot, registerSlot, createSlot, updateSlot, deleteSlot };
