// server.js

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;  // Render uses dynamic ports

// Middleware to parse incoming JSON body
app.use(express.json());

// Root route (optional, just for Render health check)
app.get('/', (req, res) => {
    res.send('Webhook server is running! 🚀');
});

// Webhook route
app.post('/webhook', (req, res) => {
    console.log("📥 New message received at /webhook:");
    console.log(JSON.stringify(req.body, null, 2)); // Pretty print the JSON

    // Important: Always quickly respond to the webhook
    res.status(200).send('Webhook received!');

    // TODO: You can add your custom processing logic here (ex: auto-reply)
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
