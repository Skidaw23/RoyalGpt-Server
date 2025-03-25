const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/product-count', async (req, res) => {
  try {
    const response = await axios.get(`https://${process.env.SHOPIFY_STORE_URL}/admin/api/2025-01/products/count.json`, {
      headers: {
        'X-Shopify-Access-Token': process.env.SHOPIFY_API_TOKEN,
        'Content-Type': 'application/json'
      }
    });
    res.status(200).json({ count: response.data.count });
  } catch (error) {
    console.error('Fout bij ophalen product count:', error.message);
    res.status(500).json({ error: 'Kon aantal producten niet ophalen' });
  }
});

module.exports = router;
