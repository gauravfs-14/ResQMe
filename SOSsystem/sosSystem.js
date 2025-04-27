// server.js

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;  // Render uses dynamic ports
const axios = require('axios');

// Middleware to parse incoming JSON body
app.use(express.json());

// Root route (optional, just for Render health check)
app.get('/', (req, res) => {
    res.send('Webhook server is running! 🚀');
});

// Webhook route
app.post('/webhook', async (req, res) => {
    console.log("📥 New webhook received:");
    console.log(JSON.stringify(req.body, null, 2));

    const { alert_type, text, recipient } = req.body;

    // Only respond if it's not a "message_sent" system alert
    if (alert_type !== "message_sent") {
        console.log("✅ Real user message detected. Sending auto-reply...");
        await sendMessage("Hello from Server!", recipient);
    } else {
        console.log("⚡ System message detected (message_sent). Skipping auto-reply.");
    }

    res.status(200).send('Webhook received!');
});



const sendMessage = async (message, number) => {
    try{
        const response = await axios.post('https://server.loopmessage.com/api/v1/message/send', {
            text: message,
            recipient: number
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer LV1O9O4XD-6HK4TACPZ-O101TGQBU-QQ84UZXIT',
                'Loop-Secret-Key': "1CZCa-zSYlOk-uscwVq_KJ0UVDFUDWpSG3RPJcBfGAR4GOSoIbWvs_A4SyJ6Rv7f"
            }
        });
        console.log("📤 Message sent successfully:", response.text);
    }
    catch (error) {
        console.error("❌ Error sending message:", error.message);
    }
}

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
