const Ad = require('../../models/Ad');
const AdSlot = require('../../models/AdSlot');
const asyncHandler = require('../../utils/asyncHandler');
const AppError = require('../../utils/AppError');

const listAds = asyncHandler(async (req, res) => {
  const { status } = req.query;
  // Get publisher's slot IDs
  const slots = await AdSlot.find({ publisher: req.user._id }).select('_id');
  const slotIds = slots.map(s => s._id);
  const filter = { adSlot: { $in: slotIds } };
  if (status) filter.status = status;
  const ads = await Ad.find(filter)
    .populate('advertiser', 'name email companyName')
    .populate('campaign', 'name')
    .populate('adSlot', 'name size')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: ads });
});

const getAd = asyncHandler(async (req, res, next) => {
  const slots = await AdSlot.find({ publisher: req.user._id }).select('_id');
  const slotIds = slots.map(s => s._id);
  const ad = await Ad.findOne({ _id: req.params.id, adSlot: { $in: slotIds } })
    .populate('advertiser', 'name email companyName')
    .populate('campaign', 'name budget')
    .populate('adSlot', 'name size pricingModel price');
  if (!ad) return next(new AppError('Ad not found', 404));
  res.json({ success: true, data: ad });
});

module.exports = { listAds, getAd };
