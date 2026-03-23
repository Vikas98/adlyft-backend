const Campaign = require('../../models/Campaign');
const asyncHandler = require('../../utils/asyncHandler');
const AppError = require('../../utils/AppError');

const listCampaigns = asyncHandler(async (req, res) => {
  const campaigns = await Campaign.find({ advertiser: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, data: campaigns });
});

const createCampaign = asyncHandler(async (req, res) => {
  const { name, description, budget, startDate, endDate, targetCategory } = req.body;
  const campaign = await Campaign.create({
    advertiser: req.user._id,
    name,
    description,
    budget,
    startDate,
    endDate,
    targetCategory,
  });
  res.status(201).json({ success: true, data: campaign });
});

const getCampaign = asyncHandler(async (req, res, next) => {
  const campaign = await Campaign.findOne({ _id: req.params.id, advertiser: req.user._id });
  if (!campaign) return next(new AppError('Campaign not found', 404));
  res.json({ success: true, data: campaign });
});

const updateCampaign = asyncHandler(async (req, res, next) => {
  const campaign = await Campaign.findOneAndUpdate(
    { _id: req.params.id, advertiser: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!campaign) return next(new AppError('Campaign not found', 404));
  res.json({ success: true, data: campaign });
});

const deleteCampaign = asyncHandler(async (req, res, next) => {
  const campaign = await Campaign.findOne({ _id: req.params.id, advertiser: req.user._id });
  if (!campaign) return next(new AppError('Campaign not found', 404));
  if (campaign.status !== 'draft') return next(new AppError('Only draft campaigns can be deleted', 400));
  await campaign.deleteOne();
  res.json({ success: true, message: 'Campaign deleted' });
});

const pauseCampaign = asyncHandler(async (req, res, next) => {
  const campaign = await Campaign.findOneAndUpdate(
    { _id: req.params.id, advertiser: req.user._id, status: 'active' },
    { status: 'paused' },
    { new: true }
  );
  if (!campaign) return next(new AppError('Active campaign not found', 404));
  res.json({ success: true, data: campaign });
});

const resumeCampaign = asyncHandler(async (req, res, next) => {
  const campaign = await Campaign.findOneAndUpdate(
    { _id: req.params.id, advertiser: req.user._id, status: 'paused' },
    { status: 'active' },
    { new: true }
  );
  if (!campaign) return next(new AppError('Paused campaign not found', 404));
  res.json({ success: true, data: campaign });
});

module.exports = { listCampaigns, createCampaign, getCampaign, updateCampaign, deleteCampaign, pauseCampaign, resumeCampaign };
