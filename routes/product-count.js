const express = require('express');
const axios = require('axios');
const router = express.Router();

// TEMPORARY hardcoded test values
const SHOP_DOMAIN = 'ge1vev-8k.myshopify.com';
const API_VERSION = '2024-01';
const API_TOKEN = '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';

router.get('/product-count', async (req, res) => {
  try {
    const url = `https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/products/count.json`;

    const response = await axios.get(url, {
      headers: {
        'X-Shopify-Access-Token': API_TOKEN,
        'Content-Type': 'application/json'
      }
    });

    res.status(200).json({ count: response.data.count });

  } catch (error) {
    console.error('FOUT:', error.response?.data || error.message);
    res.status(500).json({ error: 'Kon producten niet ophalen (testversie)' });
  }
});

module.exports = router;
