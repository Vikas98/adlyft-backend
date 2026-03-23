const AdSlot = require('../../models/AdSlot');
const asyncHandler = require('../../utils/asyncHandler');
const AppError = require('../../utils/AppError');

const listSlots = asyncHandler(async (req, res) => {
  const slots = await AdSlot.find({ publisher: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, data: slots });
});

const createSlot = asyncHandler(async (req, res) => {
  const { name, description, size, position, pricingModel, price, adPreferences } = req.body;
  const slot = await AdSlot.create({
    publisher: req.user._id,
    name,
    description,
    size,
    position,
    pricingModel,
    price,
    adPreferences,
  });
  res.status(201).json({ success: true, data: slot });
});

const getSlot = asyncHandler(async (req, res, next) => {
  const slot = await AdSlot.findOne({ _id: req.params.id, publisher: req.user._id });
  if (!slot) return next(new AppError('Ad slot not found', 404));
  res.json({ success: true, data: slot });
});

const updateSlot = asyncHandler(async (req, res, next) => {
  const slot = await AdSlot.findOneAndUpdate(
    { _id: req.params.id, publisher: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!slot) return next(new AppError('Ad slot not found', 404));
  res.json({ success: true, data: slot });
});

const deleteSlot = asyncHandler(async (req, res, next) => {
  const slot = await AdSlot.findOneAndDelete({ _id: req.params.id, publisher: req.user._id });
  if (!slot) return next(new AppError('Ad slot not found', 404));
  res.json({ success: true, message: 'Ad slot deleted' });
});

const toggleSlot = asyncHandler(async (req, res, next) => {
  const slot = await AdSlot.findOne({ _id: req.params.id, publisher: req.user._id });
  if (!slot) return next(new AppError('Ad slot not found', 404));
  slot.status = slot.status === 'active' ? 'inactive' : 'active';
  await slot.save();
  res.json({ success: true, data: slot });
});

module.exports = { listSlots, createSlot, getSlot, updateSlot, deleteSlot, toggleSlot };
