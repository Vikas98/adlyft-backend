const campaignService = require('../services/campaign.service');
const createLogger = require('../utils/logger');
const asyncHandler = require('../utils/asyncHandler');

const logger = createLogger('CampaignController');

const getCampaigns = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`, { userId: req.user._id });
  const result = await campaignService.getCampaigns({ userId: req.user._id, ...req.query });
  res.json({ success: true, ...result });
});

const getCampaign = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`, { campaignId: req.params.id });
  const campaign = await campaignService.getCampaign({ campaignId: req.params.id, userId: req.user._id });
  res.json({ success: true, data: campaign });
});

const createCampaign = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`, { userId: req.user._id });
  const campaign = await campaignService.createCampaign({ body: req.body, userId: req.user._id });
  logger.info('Responding 201 — campaign created', { campaignId: campaign._id });
  res.status(201).json({ success: true, data: campaign });
});

const updateCampaign = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`, { campaignId: req.params.id });
  const campaign = await campaignService.updateCampaign({ campaignId: req.params.id, userId: req.user._id, body: req.body });
  res.json({ success: true, data: campaign });
});

const updateCampaignStatus = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`, { campaignId: req.params.id, status: req.body.status });
  const campaign = await campaignService.updateCampaignStatus({ campaignId: req.params.id, userId: req.user._id, status: req.body.status });
  res.json({ success: true, data: campaign });
});

const deleteCampaign = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`, { campaignId: req.params.id });
  await campaignService.deleteCampaign({ campaignId: req.params.id, userId: req.user._id });
  res.json({ success: true, message: 'Campaign deleted' });
});

module.exports = { getCampaigns, getCampaign, createCampaign, updateCampaign, updateCampaignStatus, deleteCampaign };
