const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  advertiserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
  imageUrl: { type: String, required: true },
  clickUrl: { type: String, required: true },
  altText: { type: String, default: '' },
  size: { type: String, default: '320x50' },
  format: { type: String, enum: ['jpg', 'png', 'gif'], required: true },
  status: { type: String, enum: ['active', 'inactive', 'pending_review'], default: 'pending_review' },
}, { timestamps: true });

module.exports = mongoose.model('Ad', adSchema);
