const express = require('express');
const axios = require('axios');
const { isSuspiciousOrder } = require('../utils/securityCheck.js');
const router = express.Router();

const SHOP = process.env.SHOPIFY_STORE_URL;
const TOKEN = process.env.SHOPIFY_API_TOKEN;
const API_VERSION = process.env.SHOPIFY_API_VERSION || '2024-01';
const HEADERS = {
  'X-Shopify-Access-Token': TOKEN,
  'Content-Type': 'application/json'
};

router.get('/dashboard', async (req, res) => {
  try {
    const [productsRes, ordersRes] = await Promise.all([
      axios.get(`https://${SHOP}/admin/api/${API_VERSION}/products/count.json`, { headers: HEADERS }),
      axios.get(`https://${SHOP}/admin/api/${API_VERSION}/orders.json?status=any&limit=100`, { headers: HEADERS })
    ]);

    const productCount = productsRes.data.count;
    const orders = ordersRes.data.orders;

    const orderCount = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_price), 0);
    const suspiciousOrders = orders.filter(order =>
      isSuspiciousOrder(order.email, order.total_price)
    );

    const suspiciousRate = orderCount > 0 ? ((suspiciousOrders.length / orderCount) * 100).toFixed(2) : 0;

    res.json({
      products: productCount,
      orders: orderCount,
      revenue: totalRevenue.toFixed(2),
      suspiciousRate: `${suspiciousRate}%`
    });
  } catch (error) {
    console.error('Fout bij ophalen dashboard data:', error.message);
    res.status(500).json({ error: 'Dashboarddata ophalen mislukt' });
  }
});

module.exports = router;
