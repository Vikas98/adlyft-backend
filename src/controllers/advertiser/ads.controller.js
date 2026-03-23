const Ad = require('../../models/Ad');
const Campaign = require('../../models/Campaign');
const User = require('../../models/User');
const AdSlot = require('../../models/AdSlot');
const asyncHandler = require('../../utils/asyncHandler');
const AppError = require('../../utils/AppError');

const listAds = asyncHandler(async (req, res) => {
  const { status, campaign } = req.query;
  const filter = { advertiser: req.user._id };
  if (status) filter.status = status;
  if (campaign) filter.campaign = campaign;
  const ads = await Ad.find(filter)
    .populate('campaign', 'name status')
    .populate('publisher', 'name website')
    .populate('adSlot', 'name size')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: ads });
});

const createAd = asyncHandler(async (req, res, next) => {
  const { campaignId, publisherId, adSlotId, title, description, imageUrl, destinationUrl } = req.body;

  // Validate campaign belongs to advertiser
  const campaign = await Campaign.findOne({ _id: campaignId, advertiser: req.user._id });
  if (!campaign) return next(new AppError('Campaign not found', 404));

  // Validate publisher exists and is approved
  const publisher = await User.findOne({ _id: publisherId, role: 'publisher', status: 'approved' });
  if (!publisher) return next(new AppError('Publisher not found or not approved', 404));

  // Validate ad slot belongs to publisher and is active
  const slot = await AdSlot.findOne({ _id: adSlotId, publisher: publisherId, status: 'active' });
  if (!slot) return next(new AppError('Ad slot not found or inactive', 404));

  const ad = await Ad.create({
    advertiser: req.user._id,
    campaign: campaignId,
    publisher: publisherId,
    adSlot: adSlotId,
    title,
    description,
    imageUrl,
    destinationUrl,
    status: 'pending',
  });

  res.status(201).json({ success: true, data: ad });
});

const getAd = asyncHandler(async (req, res, next) => {
  const ad = await Ad.findOne({ _id: req.params.id, advertiser: req.user._id })
    .populate('campaign', 'name budget')
    .populate('publisher', 'name website')
    .populate('adSlot', 'name size pricingModel price');
  if (!ad) return next(new AppError('Ad not found', 404));
  res.json({ success: true, data: ad });
});

const updateAd = asyncHandler(async (req, res, next) => {
  const ad = await Ad.findOne({ _id: req.params.id, advertiser: req.user._id });
  if (!ad) return next(new AppError('Ad not found', 404));
  if (!['pending', 'rejected'].includes(ad.status)) {
    return next(new AppError('Only pending or rejected ads can be updated', 400));
  }
  const allowed = ['title', 'description', 'imageUrl', 'destinationUrl'];
  allowed.forEach(f => { if (req.body[f] !== undefined) ad[f] = req.body[f]; });
  if (ad.status === 'rejected') ad.status = 'pending'; // re-submit
  await ad.save();
  res.json({ success: true, data: ad });
});

const deleteAd = asyncHandler(async (req, res, next) => {
  const ad = await Ad.findOne({ _id: req.params.id, advertiser: req.user._id });
  if (!ad) return next(new AppError('Ad not found', 404));
  if (!['pending', 'rejected'].includes(ad.status)) {
    return next(new AppError('Only pending or rejected ads can be deleted', 400));
  }
  await ad.deleteOne();
  res.json({ success: true, message: 'Ad deleted' });
});

module.exports = { listAds, createAd, getAd, updateAd, deleteAd };
