const servicesData = require('../data/services.json');
const portfolioData = require('../data/portfolio.json');

/**
 * Get List of Creative Services
 */
const getServices = (req, res) => {
  return res.status(200).json({
    success: true,
    count: servicesData.length,
    data: servicesData
  });
};

/**
 * Get List of Portfolio Items (With optional category filtering)
 */
const getPortfolio = (req, res) => {
  const { category } = req.query;

  let items = portfolioData;
  if (category && category !== 'all') {
    items = portfolioData.filter(item => item.category === category);
  }

  return res.status(200).json({
    success: true,
    count: items.length,
    data: items
  });
};

module.exports = { getServices, getPortfolio };
