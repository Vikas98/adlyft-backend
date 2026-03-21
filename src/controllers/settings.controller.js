const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

const getProfile = async (req, res) => {
  res.json({
    success: true,
    data: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      company: req.user.company,
      phone: req.user.phone,
      address: req.user.address,
      role: req.user.role,
      notificationPrefs: req.user.notificationPrefs,
    },
  });
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, company, phone, address } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, company, phone, address },
      { new: true, runValidators: true }
    ).select('-password');
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const updateNotifications = async (req, res, next) => {
  try {
    const { emailAlerts, weeklyReports } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 'notificationPrefs.emailAlerts': emailAlerts, 'notificationPrefs.weeklyReports': weeklyReports },
      { new: true }
    ).select('-password');
    res.json({ success: true, data: { notificationPrefs: user.notificationPrefs } });
  } catch (error) {
    next(error);
  }
};

const getApiKey = async (req, res) => {
  const key = req.user.apiKey || '';
  const masked = key.length > 8 ? key.slice(0, 4) + '****' + key.slice(-4) : '****';
  res.json({ success: true, data: { apiKey: masked } });
};

const regenerateApiKey = async (req, res, next) => {
  try {
    const newKey = uuidv4();
    await User.findByIdAndUpdate(req.user._id, { apiKey: newKey });
    const masked = newKey.slice(0, 4) + '****' + newKey.slice(-4);
    res.json({ success: true, data: { apiKey: masked } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, updateNotifications, getApiKey, regenerateApiKey };
