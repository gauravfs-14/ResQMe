// server.js

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000; // Render uses dynamic ports
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Middleware to parse incoming JSON body
app.use(express.json());

// Root route (optional, just for Render health check)
app.get("/", (req, res) => {
  res.send("Webhook server is running! 🚀");
});

// Webhook route
app.post("/webhook", async (req, res) => {
  console.log("📥 New webhook received:");
  console.log(JSON.stringify(req.body, null, 2));

  const { alert_type, recipient } = req.body;

  // Only respond if it's not a "message_sent" system alert
  if (alert_type !== "message_sent") {
    console.log("✅ Real user message detected. Sending auto-reply...");

    // Fetch user data from the database
    const user = await getUser(recipient);
    if (user) {
      console.log("📥 User data fetched successfully:", user);
      await sendMessage(
        `Hello ${user.fullName}! Please send HELP if you are in danger.`,
        recipient
      );
    } else {
      console.log("❌ User not found in the database.");
      await sendMessage(
        "User not found in the database. Please create your account at http://localhost:3000",
        recipient
      );
      return res.status(404).send("User not found");
    }
  } else {
    console.log(
      "⚡ System message detected (message_sent). Skipping auto-reply."
    );
  }

  res.status(200).send("Webhook received!");
});

const sendMessage = async (message, number) => {
  try {
    const response = await axios.post(
      "https://server.loopmessage.com/api/v1/message/send",
      {
        text: message,
        recipient: number,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.LOOP_AUTH}`,
          "Loop-Secret-Key": process.env.LOOP_AUTH_SECRET,
        },
      }
    );
    console.log("📤 Message sent successfully:", response.text);
  } catch (error) {
    console.error("❌ Error sending message:", error.message);
  }
};

const getUser = async (number) => {
  try {
    const user = await prisma.userProfile.findFirst({
      where: {
        phone: number,
      },
      include: {
        emergencyContacts: true, // optional: if you want more data
        currentMedications: true,
        communicationPreferences: true,
        deviceInfo: true,
      },
    });
    return user;
  } catch (error) {
    console.error("❌ Error fetching user:", error.message);
  }
};

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
