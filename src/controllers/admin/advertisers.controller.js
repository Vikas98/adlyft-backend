const User = require('../../models/User');
const Campaign = require('../../models/Campaign');
const Ad = require('../../models/Ad');
const asyncHandler = require('../../utils/asyncHandler');
const AppError = require('../../utils/AppError');

const listAdvertisers = asyncHandler(async (req, res) => {
  const advertisers = await User.find({ role: 'advertiser' }).select('-password').sort({ createdAt: -1 });
  res.json({ success: true, data: advertisers });
});

const getAdvertiser = asyncHandler(async (req, res, next) => {
  const advertiser = await User.findOne({ _id: req.params.id, role: 'advertiser' }).select('-password');
  if (!advertiser) return next(new AppError('Advertiser not found', 404));
  const campaigns = await Campaign.find({ advertiser: advertiser._id });
  const ads = await Ad.find({ advertiser: advertiser._id }).populate('campaign adSlot');
  res.json({ success: true, data: { advertiser, campaigns, ads } });
});

const blockAdvertiser = asyncHandler(async (req, res, next) => {
  const advertiser = await User.findOneAndUpdate(
    { _id: req.params.id, role: 'advertiser' },
    { status: 'blocked' },
    { new: true }
  ).select('-password');
  if (!advertiser) return next(new AppError('Advertiser not found', 404));
  res.json({ success: true, data: advertiser, message: 'Advertiser blocked' });
});

const deleteAdvertiser = asyncHandler(async (req, res, next) => {
  const advertiser = await User.findOneAndDelete({ _id: req.params.id, role: 'advertiser' });
  if (!advertiser) return next(new AppError('Advertiser not found', 404));
  res.json({ success: true, message: 'Advertiser deleted' });
});

module.exports = { listAdvertisers, getAdvertiser, blockAdvertiser, deleteAdvertiser };
