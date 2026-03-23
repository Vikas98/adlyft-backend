const mongoose = require('mongoose');

const adSlotSchema = new mongoose.Schema({
  publisher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  size: { type: String, enum: ['banner', 'leaderboard', 'rectangle', 'skyscraper', 'interstitial'], required: true },
  position: { type: String, default: '' }, // e.g. 'header', 'sidebar', 'footer', 'in-content'
  pricingModel: { type: String, enum: ['CPM', 'CPC'], default: 'CPM' },
  price: { type: Number, default: 0 },
  adPreferences: {
    allowedCategories: [String],
    blockedCategories: [String],
    allowedFormats: [String],
  },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('AdSlot', adSlotSchema);
