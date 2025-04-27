// server.js

const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");

dotenv.config();
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("Webhook server is running! 🚀");
});

// Webhook route
app.post("/webhook", async (req, res) => {
  console.log("📥 New webhook received:");
  console.log(JSON.stringify(req.body, null, 2));

  const { alert_type, recipient, text } = req.body;

  if (alert_type !== "message_sent") {
    console.log("✅ Real user message detected.");

    // Fetch user data from the database
    const user = await getUser(recipient);

    if (!user) {
      console.log("❌ User not found in the database.");
      await sendMessage(
        "User not found. Please create your account first at http://localhost:3000",
        recipient
      );
      return res.status(404).send("User not found");
    }

    console.log("📥 User data fetched successfully:", user);

    // Check if message contains a map URL (location)
    const hasLocation = containsMapURL(text);

    if (!hasLocation) {
      console.log("📍 No location detected. Asking for location...");
      await sendMessage(
        `Hi ${user.fullName}, please share your current location using Apple Maps or Google Maps link for faster help.`,
        recipient
      );
    } else {
      console.log("🛟 Location detected. Preparing SOS alert...");

      // Create context for LLM
      const llmPrompt = generatePrompt(user, text);

      // Send to LLM API
      const sosInfo = await callLLM(llmPrompt);

      // Simulate sending SOS
      console.log("🚨 SOS Alert Prepared:");
      console.log(JSON.stringify(sosInfo, null, 2));

      // Here you could POST to your SOS API instead of console.log
      // await axios.post("https://your-sos-api.com/alert", sosInfo);
    }
  } else {
    console.log(
      "⚡ System message detected (message_sent). Skipping auto-reply."
    );
  }

  res.status(200).send("Webhook processed!");
});

// Check if text contains a location link
const containsMapURL = (text) => {
  const mapRegex = /(maps\.apple\.com|google\.com\/maps)/i;
  return mapRegex.test(text);
};

// Generate the prompt for LLM
const generatePrompt = (user, incomingMessage) => {
  return `
You are an AI assisting with SOS alerts. 
Given the following user profile and message, assess the urgency and prepare an SOS alert.

User Profile:
- Full Name: ${user.fullName}
- Phone: ${user.phone}
- Device: ${user.deviceInfo?.deviceType || "Unknown"}
- Location Sharing Consent: ${user.locationTrackingConsent ? "Yes" : "No"}

Emergency Contacts:
${
  user.emergencyContacts
    .map((c, i) => `  ${i + 1}. ${c.name} (${c.relation}) - ${c.phone}`)
    .join("\n") || "  None"
}

Message Received:
"${incomingMessage}"

Tasks:
1. Estimate severity level (Low, Moderate, High, Critical).
2. Identify type of help needed (Medical, Police, Fire, Other).
3. Suggest immediate next action.

Respond in JSON format:
{
  "severity": "...",
  "help_type": "...",
  "next_action": "...",
  "location_url": "Extracted if available from user message"
}
  `.trim();
};

// Call the local LLM API
const callLLM = async (prompt) => {
  try {
    const response = await axios.post(
      `${process.env.NAVIGATOR_URL}/prompt`,
      {
        message: [
          {
            role: "system",
            content: "You are an emergency SOS assistant AI.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": process.env.NAVIGATOR_AUTH,
        },
        responseType: "stream", // important for SSE
      }
    );

    let output = "";

    for await (const chunk of response.data) {
      output += chunk.toString();
    }

    // Parse output manually because it's SSE stream
    const matches = output.match(/\{.*\}/s);
    if (matches) {
      return JSON.parse(matches[0]);
    } else {
      console.error("❌ No valid JSON in LLM response.");
      return null;
    }
  } catch (error) {
    console.error("❌ Error calling LLM:", error.message);
    return null;
  }
};

// Send a reply message
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
    console.log("📤 Message sent successfully!");
  } catch (error) {
    console.error("❌ Error sending message:", error.message);
  }
};

// Fetch user profile from DB
const getUser = async (number) => {
  try {
    const user = await prisma.userProfile.findFirst({
      where: { phone: number },
      include: {
        emergencyContacts: true,
        currentMedications: true,
        communicationPreferences: true,
        deviceInfo: true,
      },
    });
    return user;
  } catch (error) {
    console.error("❌ Error fetching user:", error.message);
    return null;
  }
};

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
