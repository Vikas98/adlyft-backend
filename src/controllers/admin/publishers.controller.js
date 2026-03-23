const User = require('../../models/User');
const AdSlot = require('../../models/AdSlot');
const asyncHandler = require('../../utils/asyncHandler');
const AppError = require('../../utils/AppError');

const listPublishers = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = { role: 'publisher' };
  if (status) filter.status = status;
  const publishers = await User.find(filter).select('-password').sort({ createdAt: -1 });
  res.json({ success: true, data: publishers });
});

const getPublisher = asyncHandler(async (req, res, next) => {
  const publisher = await User.findOne({ _id: req.params.id, role: 'publisher' }).select('-password');
  if (!publisher) return next(new AppError('Publisher not found', 404));
  const slots = await AdSlot.find({ publisher: publisher._id });
  res.json({ success: true, data: { publisher, slots } });
});

const approvePublisher = asyncHandler(async (req, res, next) => {
  const publisher = await User.findOneAndUpdate(
    { _id: req.params.id, role: 'publisher' },
    { status: 'approved' },
    { new: true }
  ).select('-password');
  if (!publisher) return next(new AppError('Publisher not found', 404));
  res.json({ success: true, data: publisher, message: 'Publisher approved' });
});

const rejectPublisher = asyncHandler(async (req, res, next) => {
  const publisher = await User.findOneAndUpdate(
    { _id: req.params.id, role: 'publisher' },
    { status: 'rejected' },
    { new: true }
  ).select('-password');
  if (!publisher) return next(new AppError('Publisher not found', 404));
  res.json({ success: true, data: publisher, message: 'Publisher rejected' });
});

const blockPublisher = asyncHandler(async (req, res, next) => {
  const publisher = await User.findOneAndUpdate(
    { _id: req.params.id, role: 'publisher' },
    { status: 'blocked' },
    { new: true }
  ).select('-password');
  if (!publisher) return next(new AppError('Publisher not found', 404));
  res.json({ success: true, data: publisher, message: 'Publisher blocked' });
});

const deletePublisher = asyncHandler(async (req, res, next) => {
  const publisher = await User.findOneAndDelete({ _id: req.params.id, role: 'publisher' });
  if (!publisher) return next(new AppError('Publisher not found', 404));
  await AdSlot.deleteMany({ publisher: publisher._id });
  res.json({ success: true, message: 'Publisher deleted' });
});

module.exports = { listPublishers, getPublisher, approvePublisher, rejectPublisher, blockPublisher, deletePublisher };
