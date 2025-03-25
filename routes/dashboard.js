
const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', async (req, res) => {
  try {
    const shop = process.env.SHOPIFY_STORE_URL;
    const token = process.env.SHOPIFY_API_TOKEN;

    const response = await axios.get(`https://${shop}/admin/api/2024-01/products/count.json`, {
      headers: {
        'X-Shopify-Access-Token': token,
        'Content-Type': 'application/json'
      }
    });

    res.status(200).json({
      status: 'Live',
      store: shop,
      productCount: response.data.count,
      message: 'RoyalGPT automation dashboard ready.'
    });
  } catch (error) {
    console.error('Dashboard error:', error.message);
    res.status(500).json({ error: 'Dashboard kon geen gegevens ophalen.' });
  }
});

module.exports = router;
