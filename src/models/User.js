const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'publisher', 'advertiser'], required: true, default: 'advertiser' },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'blocked'], default: 'approved' },
  // Advertiser fields
  companyName: { type: String, default: '' },
  // Publisher fields
  website: { type: String, default: '' },
  websiteCategory: { type: String, default: '' },
  // Common
  phone: { type: String, default: '' },
  avatar: { type: String, default: '' },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
