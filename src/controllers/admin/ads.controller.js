const Ad = require('../../models/Ad');
const asyncHandler = require('../../utils/asyncHandler');
const AppError = require('../../utils/AppError');

const listAds = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status) filter.status = status;
  const ads = await Ad.find(filter)
    .populate('advertiser', 'name email')
    .populate('publisher', 'name email')
    .populate('campaign', 'name')
    .populate('adSlot', 'name size')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: ads });
});

const getAd = asyncHandler(async (req, res, next) => {
  const ad = await Ad.findById(req.params.id)
    .populate('advertiser', 'name email companyName')
    .populate('publisher', 'name email website')
    .populate('campaign', 'name budget status')
    .populate('adSlot', 'name size pricingModel price');
  if (!ad) return next(new AppError('Ad not found', 404));
  res.json({ success: true, data: ad });
});

const approveAd = asyncHandler(async (req, res, next) => {
  const ad = await Ad.findByIdAndUpdate(
    req.params.id,
    { status: 'approved', approvedAt: new Date(), approvedBy: req.user._id, adminNote: req.body.adminNote || '' },
    { new: true }
  );
  if (!ad) return next(new AppError('Ad not found', 404));
  res.json({ success: true, data: ad, message: 'Ad approved' });
});

const rejectAd = asyncHandler(async (req, res, next) => {
  const { adminNote } = req.body;
  if (!adminNote) return next(new AppError('Admin note is required for rejection', 400));
  const ad = await Ad.findByIdAndUpdate(
    req.params.id,
    { status: 'rejected', adminNote },
    { new: true }
  );
  if (!ad) return next(new AppError('Ad not found', 404));
  res.json({ success: true, data: ad, message: 'Ad rejected' });
});

module.exports = { listAds, getAd, approveAd, rejectAd };
