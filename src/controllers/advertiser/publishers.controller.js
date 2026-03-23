const User = require('../../models/User');
const AdSlot = require('../../models/AdSlot');
const asyncHandler = require('../../utils/asyncHandler');
const AppError = require('../../utils/AppError');

const listPublishers = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const filter = { role: 'publisher', status: 'approved' };
  if (category) filter.websiteCategory = category;
  const publishers = await User.find(filter).select('name website websiteCategory createdAt').sort({ createdAt: -1 });
  res.json({ success: true, data: publishers });
});

const getPublisher = asyncHandler(async (req, res, next) => {
  const publisher = await User.findOne({ _id: req.params.id, role: 'publisher', status: 'approved' })
    .select('name website websiteCategory createdAt');
  if (!publisher) return next(new AppError('Publisher not found', 404));
  const slots = await AdSlot.find({ publisher: publisher._id, status: 'active' });
  res.json({ success: true, data: { publisher, slots } });
});

module.exports = { listPublishers, getPublisher };
