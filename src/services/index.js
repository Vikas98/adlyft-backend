const authService = require('./auth.service');
const adService = require('./ad.service');
const adSlotService = require('./adSlot.service');
const analyticsService = require('./analytics.service');
const billingService = require('./billing.service');
const campaignService = require('./campaign.service');
const invoiceService = require('./invoice.service');
const publisherService = require('./publisher.service');
const servingService = require('./serving.service');
const settingsService = require('./settings.service');
const userService = require('./user.service');

module.exports = {
  authService,
  adService,
  adSlotService,
  analyticsService,
  billingService,
  campaignService,
  invoiceService,
  publisherService,
  servingService,
  settingsService,
  userService,
};
