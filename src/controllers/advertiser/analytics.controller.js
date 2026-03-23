const asyncHandler = require('../../utils/asyncHandler');

const getOverview = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { impressions: 0, clicks: 0, ctr: 0, spend: 0 } });
});

const getCampaignAnalytics = asyncHandler(async (req, res) => {
  res.json({ success: true, data: [] });
});

const getCampaignDetail = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { campaignId: req.params.id, impressions: 0, clicks: 0, ctr: 0, spend: 0 } });
});

module.exports = { getOverview, getCampaignAnalytics, getCampaignDetail };
