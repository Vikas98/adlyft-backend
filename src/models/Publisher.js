const mongoose = require('mongoose');

const publisherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  appName: { type: String, required: true },
  category: {
    type: String,
    enum: ['Transport', 'Gaming', 'News', 'Finance', 'Food Delivery', 'Health & Fitness', 'Education', 'Entertainment', 'Shopping', 'Social'],
    required: true,
  },
  description: { type: String, default: '' },
  website: { type: String, default: '' },
  dau: { type: Number, default: 0 },
  platform: { type: String, enum: ['Android', 'iOS', 'Web', 'All'], default: 'All' },
  avgCTR: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive', 'pending'], default: 'active' },
  contactEmail: { type: String, default: '' },
  apiKey: { type: String, unique: true },
}, { timestamps: true });

module.exports = mongoose.model('Publisher', publisherSchema);
