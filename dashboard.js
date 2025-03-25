const express = require('express');
const router = express.Router();
const axios = require('axios');
const { isSuspiciousOrder } = require('./utils/securityCheck'); // Correct path
const sendEmail = require('./emails/notify');

// Dashboard overview endpoint
router.get('/dashboard', async (req, res) => {
  try {
    // Fetch product count from Shopify
    const productResponse = await axios.get(`https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-01/products/count.json`, {
      headers: {
        'X-Shopify-Access-Token': process.env.SHOPIFY_API_TOKEN,
        'Content-Type': 'application/json'
      }
    });

    const productCount = productResponse.data.count;

    // Example suspicious order check
    const testOrder = {
      customer_email: 'test@example.com',
      total_price: 999
    };

    const suspicious = isSuspiciousOrder(testOrder.customer_email, testOrder.total_price);

    res.status(200).json({
      status: 'RoyalGPT Dashboard Live',
      productCount,
      suspiciousTest: suspicious
    });

  } catch (error) {
    console.error('Dashboard error:', error.message);
    res.status(500).json({ error: 'Dashboard data fetch failed' });
  }
});

module.exports = router;
