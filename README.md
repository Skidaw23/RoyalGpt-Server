
# RoyalGPT Full Automation Flow

This server handles Shopify order_created webhooks, performs checks, calculates tax, and sends alerts.

## Features
- Real-time webhook handler
- Email notification for suspicious orders
- Country-based tax calculation
- Render deploy-ready

## Deploy Instructions
- Push to GitHub
- Connect to Render as Web Service
- Add environment variables:
  - ADMIN_EMAIL
  - EMAIL_PASS
- Build Command: `npm install`
- Start Command: `npm start`
