const { protect } = require('./auth');
const errorHandler = require('./errorHandler');
const validate = require('./validate');
const { apiLimiter, authLimiter, servingLimiter } = require('./rateLimiter');

module.exports = {
  protect,
  errorHandler,
  validate,
  apiLimiter,
  authLimiter,
  servingLimiter,
};
