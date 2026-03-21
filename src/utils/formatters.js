const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num);
};

const formatCTR = (clicks, impressions) => {
  if (!impressions || impressions === 0) return '0.00%';
  return ((clicks / impressions) * 100).toFixed(2) + '%';
};

module.exports = { formatCurrency, formatNumber, formatCTR };
