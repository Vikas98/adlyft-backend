const asyncHandler = require('../../utils/asyncHandler');

const getOverview = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { impressions: 0, clicks: 0, ctr: 0, revenue: 0 } });
});

const getSlotAnalytics = asyncHandler(async (req, res) => {
  res.json({ success: true, data: [] });
});

const getSlotDetail = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { slotId: req.params.id, impressions: 0, clicks: 0, ctr: 0, revenue: 0 } });
});

module.exports = { getOverview, getSlotAnalytics, getSlotDetail };
