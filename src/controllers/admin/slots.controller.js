const AdSlot = require('../../models/AdSlot');
const asyncHandler = require('../../utils/asyncHandler');
const AppError = require('../../utils/AppError');

const listSlots = asyncHandler(async (req, res) => {
  const slots = await AdSlot.find().populate('publisher', 'name email website').sort({ createdAt: -1 });
  res.json({ success: true, data: slots });
});

const getSlot = asyncHandler(async (req, res, next) => {
  const slot = await AdSlot.findById(req.params.id).populate('publisher', 'name email website');
  if (!slot) return next(new AppError('Ad slot not found', 404));
  res.json({ success: true, data: slot });
});

const deleteSlot = asyncHandler(async (req, res, next) => {
  const slot = await AdSlot.findByIdAndDelete(req.params.id);
  if (!slot) return next(new AppError('Ad slot not found', 404));
  res.json({ success: true, message: 'Ad slot deleted' });
});

module.exports = { listSlots, getSlot, deleteSlot };
