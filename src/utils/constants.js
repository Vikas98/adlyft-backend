const PUBLISHER_CATEGORIES = ['Transport', 'Gaming', 'News', 'Finance', 'Food Delivery', 'Health & Fitness', 'Education', 'Entertainment', 'Shopping', 'Social'];
const AD_TYPES = ['banner', 'interstitial', 'native', 'fullscreen'];
const CAMPAIGN_STATUSES = ['draft', 'active', 'paused', 'completed'];
const AD_STATUSES = ['active', 'inactive', 'pending_review'];
const SLOT_STATUSES = ['available', 'booked', 'inactive'];
const ACTIVITY_TYPES = ['campaign_created', 'campaign_launched', 'campaign_paused', 'publisher_added', 'payment_received', 'ad_uploaded'];
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

const MAX_UPLOAD_SIZE_BYTES = parseInt(process.env.MAX_UPLOAD_SIZE_MB || '5') * 1024 * 1024;

module.exports = {
  PUBLISHER_CATEGORIES,
  AD_TYPES,
  CAMPAIGN_STATUSES,
  AD_STATUSES,
  SLOT_STATUSES,
  ACTIVITY_TYPES,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MAX_UPLOAD_SIZE_BYTES,
};
