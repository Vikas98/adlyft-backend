const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { v4: uuidv4 } = require('uuid');
const createLogger = require('../utils/logger');

const logger = createLogger('AuthService');

const register = async ({ name, email, password, company }) => {
  logger.info('Registering new user', { email });
  const existing = await User.findOne({ email });
  if (existing) {
    logger.warn('Registration failed — email already in use', { email });
    const err = new Error('Email already in use');
    err.statusCode = 400;
    throw err;
  }

  const user = await User.create({
    name,
    email,
    password,
    company: company || '',
    apiKey: uuidv4(),
  });

  const token = generateToken(user._id);
  logger.info('User registered successfully', { userId: user._id });
  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      company: user.company,
      role: user.role,
    },
  };
};

const login = async ({ email, password }) => {
  logger.info('Login attempt', { email });
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    logger.warn('Login failed — invalid credentials', { email });
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const token = generateToken(user._id);
  logger.info('User logged in successfully', { userId: user._id });
  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      company: user.company,
      role: user.role,
    },
  };
};

const getMe = (user) => {
  logger.debug('Fetching current user profile', { userId: user._id });
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    company: user.company,
    phone: user.phone,
    address: user.address,
    role: user.role,
    notificationPrefs: user.notificationPrefs,
    createdAt: user.createdAt,
  };
};

module.exports = { register, login, getMe };
