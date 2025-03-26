require('dotenv').config();

const shopifyApiKey = process.env.SHOPIFY_API_KEY;
const shopifySecret = process.env.SHOPIFY_API_SECRET;
const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN;
const openaiApiKey = process.env.OPENAI_API_KEY;
const notifyEmail = process.env.EMAIL_TO_NOTIFY;
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { isSuspiciousOrder } = require('./utils/securityCheck');
const { sendEmail } = require('./emails/notify');
const productCountRoute = require('./routes/product-count');
const dashboardRoute = require('./routes/dashboard');

const app = express();
app.use(bodyParser.json());

// Routes
app.use('/', productCountRoute);
app.use('/dashboard', dashboardRoute);

const PORT = process.env.PORT || 3000;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

// Tax calculation
function calculateTax(country, total) {
  const taxRates = {
    NL: 0.21,
    DE: 0.19,
    FR: 0.20,
    US: 0.00
  };
  const rate = taxRates[country] || 0.15;
  return parseFloat(total) * rate;
}

// Webhook endpoint for new orders
app.post('/webhook', async (req, res) => {
  const data = req.body;
  const order = data.data || {};
  const { customer_email, total_price, shipping_address } = order;

  const suspicious = isSuspiciousOrder(customer_email, total_price);
  const tax = calculateTax(shipping_address?.country_code, total_price);
  const message = suspicious
    ? 'Suspicious order flagged.'
    : 'Order passed security checks.';

  const mailOptions = {
    from: ADMIN_EMAIL,
    to: ADMIN_EMAIL,
    subject: suspicious ? 'Suspicious Order Alert' : 'New Order Created',
    text: `
Order ID: ${order.id}
Customer: ${order.customer?.first_name} ${order.customer?.last_name}
Email: ${customer_email}
Total: €${total_price}
Country: ${shipping_address?.country_code}
Tax: €${tax.toFixed(2)}
Status: ${message}
    `
  };

  try {
    await sendEmail(mailOptions);
    console.log('Email sent');
    res.status(200).send('Webhook processed');
  } catch (error) {
    console.error('Email error:', error.message);
    res.status(500).send('Failed to send email');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
