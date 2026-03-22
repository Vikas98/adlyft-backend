const authController = require('./auth.controller');
const campaignController = require('./campaign.controller');
const publisherController = require('./publisher.controller');
const adSlotController = require('./adSlot.controller');
const adController = require('./ad.controller');
const invoiceController = require('./invoice.controller');
const servingController = require('./serving.controller');
const analyticsController = require('./analytics.controller');
const billingController = require('./billing.controller');
const settingsController = require('./settings.controller');
const userController = require('./user.controller');

module.exports = {
  authController,
  campaignController,
  publisherController,
  adSlotController,
  adController,
  invoiceController,
  servingController,
  analyticsController,
  billingController,
  settingsController,
  userController,
};
