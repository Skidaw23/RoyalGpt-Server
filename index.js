
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const nodemailer = require('nodemailer');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const EMAIL_PASS = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: ADMIN_EMAIL,
    pass: EMAIL_PASS
  }
});

function isSuspicious(email, total) {
  return email.endsWith('@tempmail.com') || parseFloat(total) > 500;
}

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

app.post('/webhook', async (req, res) => {
  const data = req.body;
  const order = data.data || {};
  const { customer_email, total_price, shipping_address } = order;

  const suspicious = isSuspicious(customer_email, total_price);
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
    await transporter.sendMail(mailOptions);
    console.log('Email sent');
    res.status(200).send('Webhook processed');
  } catch (err) {
    console.error('Error sending email', err);
    res.status(500).send('Error processing webhook');
  }
});

app.get('/', (req, res) => {
  res.send('RoyalGPT order processor is live');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
