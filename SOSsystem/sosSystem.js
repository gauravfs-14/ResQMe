const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");

dotenv.config();
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3005;

app.use(express.json());

const processingUsers = new Set();
const nearbyContext = {};

// ------------------ Utilities ------------------

const fetchNearbyContext = async (latitude, longitude) => {
  try {
    const response = await axios.get(
      `http://localhost:3232/nearby?lat=${latitude}&lng=${longitude}`
    );
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching nearby context:", error.message);
    return null;
  }
};

const tools = [
  {
    type: "function",
    function: {
      name: "get_nearby_context",
      description:
        "Get nearby hospitals, police, fire stations, and current weather using coordinates",
      parameters: {
        type: "object",
        properties: {
          latitude: { type: "number", description: "Latitude of the location" },
          longitude: {
            type: "number",
            description: "Longitude of the location",
          },
        },
        required: ["latitude", "longitude"],
      },
    },
  },
];

const buildSystemPrompt = (user) => ({
  role: "system",
  content: `You are an Emergency Detection AI System.
  
  User Profile:
  - Full Name: ${user.fullName}
  - Device: ${user.deviceInfo?.deviceType || "Unknown"}
  
  Your tasks:
  - Analyze user's recent chat history.
  - If latitude or longitude is missing, you MUST ask user to share their location (a Google/Apple Maps URL).
  - You cannot move forward without coordinates.
  - Once coordinates are available, you MUST call the get_nearby_context tool using the coordinates.
  - If no situation description is found, ask for it. You must have a clear situation before deciding SOS. Do not trigger SOS for single words like \"Help\" alone.
  - After receiving nearby context, continue decision making.
  - If SOS is triggered, provide a full location pin URL based on coordinates (Apple or Google Maps link).
  - Always output ONLY JSON in this format for other than tool calls:
  {
    "ask_for_location": true/false,
    "ask_for_description": true/false,
    "sos_trigger": true/false,
    "severity": "Low/Moderate/High/Critical",
    "confidence": 0-1,
    "triageNotes": "Notes for triage",
    "help_type": "Police/Medical/Fire/Other",
    "next_action": "Stay/Move/Call 911/Other",
    "location_url": "",
    "reason": ""
  }
    - Always output ONLY JSON in this format for tool calls:
    {
    "tool_calls": [
      {
        "function": {
          "name": "get_nearby_context",
          "arguments": "{\"latitude\": 0, \"longitude\": 0}"
        }
      }
    ]
  `,
});

const buildDashboardAlert = (user, nearbyContext, sosInfo) => {
  const now = new Date().toISOString();

  return {
    alertId: `sos_${Math.random().toString(36).substring(2, 10)}`,
    triggerSource: "LoopMessage",
    userId: user.id,
    timestamp: now,

    location: {
      latitude: user.latitude,
      longitude: user.longitude,
      accuracy: "high",
      geohash: null,
    },

    profileSummary: {
      fullName: user.fullName,
      medicalConditions: user.medicalConditions || [],
      allergies: user.allergies || [],
      currentMedications: user.currentMedications || [],
      preferredCommunication:
        user.communicationPreferences?.preferredMethod || "Unknown",
      emergencyContacts:
        user.emergencyContacts?.map((contact, index) => ({
          name: contact.name,
          relation: contact.relation,
          phone: contact.phone,
          priority: index + 1,
        })) || [],
      additionalNotes: user.additionalNotes || "",
    },

    aiGeneratedMessage: sosInfo.reason || "Unknown Emergency Situation.",

    severityAssessment: {
      severityLevel: sosInfo.severity,
      confidenceScore: sosInfo.confidenceScore || 0.9,
      triageNotes:
        sosInfo.triageNotes || "Classified based on AI system and context.",
    },

    serpApiContext: {
      liveIncidentsNearby: sosInfo.liveIncidentsNearby || [],
      nearbyFacilities: {
        hospitals: (nearbyContext?.places?.hospitals || []).map((h) => ({
          name: h.name,
          address: h.address,
          distanceMiles: (h.distanceValue / 1609).toFixed(2),
          contactNumber: "",
          mapsLink: `https://maps.google.com/?q=${h.coordinates.latitude},${h.coordinates.longitude}`,
        })),
        policeStations: (nearbyContext?.places?.policeStations || []).map(
          (p) => ({
            name: p.name,
            address: p.address,
            distanceMiles: (p.distanceValue / 1609).toFixed(2),
            contactNumber: "",
            mapsLink: `https://maps.google.com/?q=${p.coordinates.latitude},${p.coordinates.longitude}`,
          })
        ),
        fireStations: (nearbyContext?.places?.fireStations || []).map((f) => ({
          name: f.name,
          address: f.address,
          distanceMiles: (f.distanceValue / 1609).toFixed(2),
          contactNumber: "",
          mapsLink: `https://maps.google.com/?q=${f.coordinates.latitude},${f.coordinates.longitude}`,
        })),
      },
      weather: nearbyContext?.weather || [],
    },

    responderStatus: {
      currentStatus: "Pending",
      assignedResponderId: null,
      fallbackChainTriggered: false,
      lastUpdated: now,
    },
  };
};

const fetchLLMResponse = async (chatHistory) => {
  try {
    const response = await axios.post(
      `${process.env.NAVIGATOR_URL}/prompt`,
      { message: chatHistory, tools },
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": process.env.NAVIGATOR_AUTH,
        },
        responseType: "stream",
        timeout: 30000,
      }
    );

    let fullJson = "";
    for await (const chunk of response.data) {
      const chunkStr = chunk.toString();
      const parts = chunkStr.split('{"choices":').slice(1);
      for (const part of parts) {
        try {
          const reconstructed = '{"choices":' + part;
          const parsed = JSON.parse(reconstructed.trim());
          const contentPiece = parsed.choices?.[0]?.message?.content;
          if (contentPiece) {
            process.stdout.write(contentPiece);
            fullJson += contentPiece;
          }
        } catch (err) {
          console.error("❌ Error parsing streamed chunk:", err.message);
        }
      }
    }

    if (fullJson.includes('"tool_calls"')) {
      console.log("🛠️ Tool call detected! Handling tool request...");
      const parsedFull = JSON.parse(fullJson);
      const toolCall = parsedFull.tool_calls?.[0];

      if (toolCall?.function?.name === "get_nearby_context") {
        const { latitude, longitude } = JSON.parse(toolCall.function.arguments);
        nearbyContext = await fetchNearbyContext(latitude, longitude);

        const toolInjectedHistory = [
          ...chatHistory,
          { role: "assistant", content: JSON.stringify(toolCall) },
          {
            role: "system",
            content: `Nearby Context Retrieved:\n${JSON.stringify(
              nearbyContext,
              null,
              2
            )}\n\nContinue decision making.`,
          },
        ];

        return await fetchLLMResponse(toolInjectedHistory);
      }
    }

    console.log("\n✅ Full LLM Response captured.\n");
    return fullJson;
  } catch (error) {
    console.error("❌ Error in fetchLLMResponse:", error.message);
    return null;
  }
};

const handleStartOverCommand = async (phone) => {
  try {
    await prisma.conversationState.upsert({
      where: { phone },
      update: { state: "active" },
      create: { phone, state: "active" },
    });
    await prisma.chatHistory.deleteMany({ where: { phone } });
    await sendMessage("🔄 Conversation reset. How can I help you?", phone);
  } catch (error) {
    console.error("❌ Error resetting conversation:", error.message);
  }
};

const sendMessage = async (message, number) => {
  try {
    await axios.post(
      "https://server.loopmessage.com/api/v1/message/send",
      { text: message, recipient: number },
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

const notifyEmergencyContacts = async (user, sosInfo) => {
  if (!user.emergencyContacts || user.emergencyContacts.length === 0) return;
  const notificationText = `🚨 Emergency Alert 🚨\n\nUser: ${
    user.fullName
  }\nSeverity: ${sosInfo.severity}\nHelp Needed: ${
    sosInfo.help_type
  }\nAction: ${sosInfo.next_action}\nLocation: ${
    sosInfo.location_url || "N/A"
  }`;
  for (const contact of user.emergencyContacts) {
    await sendMessage(notificationText, contact.phone);
    console.log(`📨 Notified ${contact.name}`);
  }
};

// ------------------ Webhook Route ------------------

app.post("/webhook", async (req, res) => {
  const { alert_type, recipient, text } = req.body;

  if (alert_type !== "message_inbound") {
    console.log("⚠️ Skipping non-user message.");
    return res.status(200).send("Non-user message skipped.");
  }

  if (processingUsers.has(recipient)) {
    return res.status(429).send("Already processing");
  }

  processingUsers.add(recipient);

  try {
    if (text.toLowerCase().includes("start over")) {
      await handleStartOverCommand(recipient);
      return res.status(200).send("Conversation reset");
    }

    const conversationState = await prisma.conversationState.findUnique({
      where: { phone: recipient },
    });
    if (conversationState?.state === "resolved") {
      console.log(
        "⚡ Conversation already resolved. Ignoring further messages."
      );
      return res.status(200).send("Conversation resolved");
    }

    await prisma.chatHistory.create({
      data: { phone: recipient, role: "user", content: text },
    });
    const user = await prisma.userProfile.findFirst({
      where: { phone: recipient },
      include: { emergencyContacts: true, deviceInfo: true },
    });

    if (!user) {
      await sendMessage("❗ User not found. Please register.", recipient);
      return res.status(404).send("User not found");
    }

    const chatHistory = [
      buildSystemPrompt(user),
      ...(await prisma.chatHistory.findMany({
        where: { phone: recipient },
        orderBy: { createdAt: "asc" },
        take: 20,
      })),
    ];

    const llmResponse = await fetchLLMResponse(chatHistory);

    if (llmResponse) {
      await prisma.chatHistory.create({
        data: { phone: recipient, role: "assistant", content: llmResponse },
      });
      const sosInfo = JSON.parse(llmResponse);

      if (sosInfo.ask_for_location) {
        await sendMessage(
          "📍 Please share your current location (Google/Apple Maps URL).",
          recipient
        );
      } else if (sosInfo.ask_for_description) {
        await sendMessage(
          "📝 Please briefly describe your current situation.",
          recipient
        );
      } else if (sosInfo.sos_trigger) {
        console.log("🚨 SOS TRIGGERED:", sosInfo);
        await sendMessage("🚨 SOS triggered! Help is on the way.", recipient);
        await notifyEmergencyContacts(user, sosInfo);

        const dashboardAlert = buildDashboardAlert(
          user,
          nearbyContext,
          sosInfo
        );

        console.log(
          "📤 Dashboard Alert Payload:",
          JSON.stringify(dashboardAlert, null, 2)
        );

        // Optionally POST to Responder Dashboard API here
        // await axios.post('https://your-responder-dashboard.com/api/alerts', dashboardAlert);

        await prisma.conversationState.upsert({
          where: { phone: recipient },
          update: { state: "resolved" },
          create: { phone: recipient, state: "resolved" },
        });
      } else {
        console.log("✅ No SOS triggered:", sosInfo.reason);
        await sendMessage(
          `✅ No emergency detected. Reason: ${sosInfo.reason}`,
          recipient
        );
        await prisma.conversationState.upsert({
          where: { phone: recipient },
          update: { state: "resolved" },
          create: { phone: recipient, state: "resolved" },
        });
      }
    } else {
      await sendMessage(
        "❌ Could not process your request. Please try again.",
        recipient
      );
    }

    res.status(200).send("Processed successfully");
  } catch (error) {
    console.error("❌ Webhook error:", error.message);
    res.status(500).send("Internal server error");
  } finally {
    processingUsers.delete(recipient);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
