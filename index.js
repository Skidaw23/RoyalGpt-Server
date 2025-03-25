const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('RoyalGPT Server is live!');
});

app.post('/webhook', (req, res) => {
    console.log('Received webhook:', req.body);
    // Add your custom Shopify + GPT logic here
    res.status(200).send('Webhook received');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});