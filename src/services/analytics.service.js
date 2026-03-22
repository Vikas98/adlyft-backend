const Campaign = require('../models/Campaign');
const Impression = require('../models/Impression');
const Click = require('../models/Click');
const createLogger = require('../utils/logger');

const logger = createLogger('AnalyticsService');

const getDateRange = (range) => {
  const now = new Date();
  const days = range === '90d' ? 90 : range === '30d' ? 30 : 7;
  const start = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return { start, end: now, days };
};

const getOverview = async (userId) => {
  logger.info('Fetching analytics overview', { userId });
  const campaigns = await Campaign.find({ advertiserId: userId });
  const campaignIds = campaigns.map(c => c._id);

  const [totalImpressions, totalClicks, totalSpend] = await Promise.all([
    Impression.countDocuments({ campaignId: { $in: campaignIds } }),
    Click.countDocuments({ campaignId: { $in: campaignIds } }),
    Promise.resolve(campaigns.reduce((sum, c) => sum + c.totalSpend, 0)),
  ]);

  const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';

  logger.debug('Analytics overview computed', { userId, totalImpressions, totalClicks });
  return {
    totalImpressions,
    totalClicks,
    ctr: parseFloat(ctr),
    totalSpend,
    activeCampaigns: campaigns.filter(c => c.status === 'active').length,
    totalCampaigns: campaigns.length,
  };
};

const getTimeSeries = async ({ userId, range = '7d' }) => {
  logger.info('Fetching time-series analytics', { userId, range });
  const { start, days } = getDateRange(range);

  const campaigns = await Campaign.find({ advertiserId: userId });
  const campaignIds = campaigns.map(c => c._id);

  const [impressions, clicks] = await Promise.all([
    Impression.aggregate([
      { $match: { campaignId: { $in: campaignIds }, timestamp: { $gte: start } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    Click.aggregate([
      { $match: { campaignId: { $in: campaignIds }, timestamp: { $gte: start } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const impressionMap = {};
  impressions.forEach(i => (impressionMap[i._id] = i.count));
  const clickMap = {};
  clicks.forEach(c => (clickMap[c._id] = c.count));

  const data = [];
  for (let i = 0; i < days; i++) {
    const date = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];
    data.push({
      date: dateStr,
      impressions: impressionMap[dateStr] || 0,
      clicks: clickMap[dateStr] || 0,
    });
  }

  logger.debug('Time-series data built', { userId, range, points: data.length });
  return data;
};

const getPublisherAnalytics = async (userId) => {
  logger.info('Fetching publisher analytics', { userId });
  const campaigns = await Campaign.find({ advertiserId: userId }).populate('publisherId', 'name appName');
  const campaignIds = campaigns.map(c => c._id);

  const [impressionsByPublisher, clicksByPublisher] = await Promise.all([
    Impression.aggregate([
      { $match: { campaignId: { $in: campaignIds } } },
      { $group: { _id: '$publisherId', impressions: { $sum: 1 } } },
    ]),
    Click.aggregate([
      { $match: { campaignId: { $in: campaignIds } } },
      { $group: { _id: '$publisherId', clicks: { $sum: 1 } } },
    ]),
  ]);

  const publisherMap = {};
  campaigns.forEach(c => {
    if (c.publisherId) {
      const id = c.publisherId._id.toString();
      if (!publisherMap[id]) {
        publisherMap[id] = { publisherId: id, name: c.publisherId.name, appName: c.publisherId.appName, impressions: 0, clicks: 0 };
      }
    }
  });

  impressionsByPublisher.forEach(i => {
    if (!i._id) return;
    const id = i._id.toString();
    if (publisherMap[id]) publisherMap[id].impressions = i.impressions;
  });
  clicksByPublisher.forEach(c => {
    if (!c._id) return;
    const id = c._id.toString();
    if (publisherMap[id]) publisherMap[id].clicks = c.clicks;
  });

  const data = Object.values(publisherMap).map(p => ({
    ...p,
    ctr: p.impressions > 0 ? ((p.clicks / p.impressions) * 100).toFixed(2) : '0.00',
  }));

  logger.debug('Publisher analytics computed', { userId, publishers: data.length });
  return data;
};

const getCampaignAnalytics = async (userId) => {
  logger.info('Fetching campaign analytics', { userId });
  const campaigns = await Campaign.find({ advertiserId: userId })
    .sort({ totalImpressions: -1 })
    .limit(10)
    .populate('publisherId', 'name appName');

  const data = campaigns.map(c => ({
    id: c._id,
    name: c.name,
    status: c.status,
    publisher: c.publisherId ? c.publisherId.name : 'N/A',
    totalImpressions: c.totalImpressions,
    totalClicks: c.totalClicks,
    ctr: c.totalImpressions > 0 ? ((c.totalClicks / c.totalImpressions) * 100).toFixed(2) : '0.00',
    totalSpend: c.totalSpend,
  }));

  logger.debug('Campaign analytics computed', { userId, campaigns: data.length });
  return data;
};

module.exports = { getOverview, getTimeSeries, getPublisherAnalytics, getCampaignAnalytics };
