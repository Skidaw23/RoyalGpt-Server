
const axios = require('axios');

async function sendTestWebhook() {
  try {
    const response = await axios.post('https://royalgpt-server.onrender.com/webhook', {
      event: 'order_created',
      data: {
        order_id: 'TEST123456',
        customer: 'Jane Doe',
        total: '59.99',
        prompt: 'Summarize this order for support team.'
      }
    });
    console.log('Webhook sent! Response:', response.data);
  } catch (error) {
    console.error('Error sending webhook:', error.response?.data || error.message);
  }
}

sendTestWebhook();
