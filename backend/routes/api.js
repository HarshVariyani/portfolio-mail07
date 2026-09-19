const express = require('express');
const router = express.Router();

const { handleContactForm } = require('../controllers/contactController');
const { getServices, getPortfolio } = require('../controllers/portfolioController');

// Health Check Endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'Harsh Portfolio Backend API'
  });
});

// API Routes
router.post('/contact', handleContactForm);
router.get('/services', getServices);
router.get('/portfolio', getPortfolio);

module.exports = router;
