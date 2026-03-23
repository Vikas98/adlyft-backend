const Campaign = require('../../models/Campaign');
const asyncHandler = require('../../utils/asyncHandler');
const AppError = require('../../utils/AppError');

const listCampaigns = asyncHandler(async (req, res) => {
  const campaigns = await Campaign.find().populate('advertiser', 'name email companyName').sort({ createdAt: -1 });
  res.json({ success: true, data: campaigns });
});

const getCampaign = asyncHandler(async (req, res, next) => {
  const campaign = await Campaign.findById(req.params.id).populate('advertiser', 'name email companyName');
  if (!campaign) return next(new AppError('Campaign not found', 404));
  res.json({ success: true, data: campaign });
});

module.exports = { listCampaigns, getCampaign };
