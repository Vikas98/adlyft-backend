const publisherService = require('../services/publisher.service');
const Publisher = require('../models/Publisher');
const createLogger = require('../utils/logger');
const asyncHandler = require('../utils/asyncHandler');

const logger = createLogger('PublisherController');

const getPublishers = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  const result = await publisherService.getPublishers(req.query);
  res.json({ success: true, ...result });
});

const getPublisher = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`, { publisherId: req.params.id });
  const publisher = await publisherService.getPublisher(req.params.id);
  res.json({ success: true, data: publisher });
});

const createPublisher = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  const { name, appName, category, description, website, dau, platform, avgCTR, contactEmail } = req.body;

  if (!name || !appName || !category) {
    return res.status(400).json({ message: 'Name, appName, and category are required' });
  }

  const publisher = await Publisher.create({
    name, appName, category, description, website,
    dau: dau ?? 0,
    platform: platform || 'All',
    avgCTR: avgCTR ?? 0,
    contactEmail: contactEmail ?? '',
    status: 'active',
  });

  logger.info('Publisher created', { publisherId: publisher._id });
  res.status(201).json({ success: true, data: publisher });
});

const updatePublisher = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`, { publisherId: req.params.id });
  const { name, appName, category, description, website, dau, platform, avgCTR, contactEmail, status } = req.body;
  const updates = {};
  if (name !== undefined) updates.name = name;
  if (appName !== undefined) updates.appName = appName;
  if (category !== undefined) updates.category = category;
  if (description !== undefined) updates.description = description;
  if (website !== undefined) updates.website = website;
  if (dau !== undefined) updates.dau = dau;
  if (platform !== undefined) updates.platform = platform;
  if (avgCTR !== undefined) updates.avgCTR = avgCTR;
  if (contactEmail !== undefined) updates.contactEmail = contactEmail;
  if (status !== undefined) updates.status = status;
  const publisher = await Publisher.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!publisher) return res.status(404).json({ message: 'Publisher not found' });
  logger.info('Publisher updated', { publisherId: publisher._id });
  res.json({ success: true, data: publisher });
});

const deletePublisher = asyncHandler(async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`, { publisherId: req.params.id });
  const publisher = await Publisher.findByIdAndDelete(req.params.id);
  if (!publisher) return res.status(404).json({ message: 'Publisher not found' });
  logger.info('Publisher deleted', { publisherId: req.params.id });
  res.json({ success: true, message: 'Publisher deleted successfully' });
});

module.exports = { getPublishers, getPublisher, createPublisher, updatePublisher, deletePublisher };
