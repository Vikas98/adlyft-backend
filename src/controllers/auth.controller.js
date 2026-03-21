const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { v4: uuidv4 } = require('uuid');

const register = async (req, res, next) => {
  try {
    const { name, email, password, company } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }
    const user = await User.create({
      name,
      email,
      password,
      company: company || '',
      apiKey: uuidv4(),
    });
    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        company: user.company,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        company: user.company,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      company: req.user.company,
      phone: req.user.phone,
      address: req.user.address,
      role: req.user.role,
      notificationPrefs: req.user.notificationPrefs,
      createdAt: req.user.createdAt,
    },
  });
};

module.exports = { register, login, getMe };
