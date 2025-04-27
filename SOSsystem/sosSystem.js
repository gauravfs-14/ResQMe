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
const conversationContext = {};

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
- If no situation description is found, ask for it. You must have a clear situation before deciding SOS. Do not trigger SOS for single words like "Help" alone.
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
}`,
});

const buildDashboardAlert = (user, nearbyContext, sosInfo, lat, lng) => {
  const now = new Date().toISOString();
  return {
    alertId: `sos_${Math.random().toString(36).substring(2, 10)}`,
    triggerSource: "LoopMessage",
    userId: user.id,
    timestamp: now,
    location: {
      latitude: lat,
      longitude: lng,
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

const fetchLLMResponse = async (
  chatHistory,
  tools,
  fetchNearbyContextCallback
) => {
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
      try {
        const parsed = JSON.parse(chunkStr.trim());
        const contentPiece = parsed.choices?.[0]?.message?.content;
        if (contentPiece) {
          process.stdout.write(contentPiece);
          fullJson += contentPiece;
        }
      } catch (err) {
        console.error("❌ Error parsing chunk:", err.message);
      }
    }

    if (fullJson.includes('"tool_calls"')) {
      const parsedFull = JSON.parse(fullJson);
      const toolCall = parsedFull.tool_calls?.[0];

      if (toolCall?.function?.name === "get_nearby_context") {
        const { latitude, longitude } = JSON.parse(toolCall.function.arguments);
        const nearbyContext = await fetchNearbyContextCallback(
          latitude,
          longitude
        );

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

        return fetchLLMResponse(
          toolInjectedHistory,
          tools,
          fetchNearbyContextCallback
        );
      }
    }

    console.log("\n✅ Full LLM Response captured.\n");
    return fullJson;
  } catch (error) {
    console.error("❌ Error in fetchLLMResponse:", error.message);
    return null;
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

const extractLatLngFromLocationUrl = (url) => {
  try {
    const match = url.match(/coordinate=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match) {
      return {
        latitude: parseFloat(match[1]),
        longitude: parseFloat(match[2]),
      };
    }
  } catch (err) {
    console.error("❌ Error extracting lat/lng:", err.message);
  }
  return { latitude: null, longitude: null };
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

    const [user, conversationState] = await Promise.all([
      prisma.userProfile.findFirst({
        where: { phone: recipient },
        include: { emergencyContacts: true, deviceInfo: true },
      }),
      prisma.conversationState.findUnique({ where: { phone: recipient } }),
    ]);

    if (!user) {
      await sendMessage("❗ User not found. Please register.", recipient);
      return res.status(404).send("User not found");
    }

    if (conversationState?.state === "resolved") {
      console.log(
        "⚡ Conversation already resolved. Ignoring further messages."
      );
      return res.status(200).send("Conversation resolved");
    }

    await prisma.chatHistory.create({
      data: { phone: recipient, role: "user", content: text },
    });

    if (!conversationContext[recipient]) {
      conversationContext[recipient] = {
        locationReceived: false,
        descriptionReceived: false,
        pendingSOS: null,
      };
    }

    if (text.includes("maps.apple.com") || text.includes("google.com/maps")) {
      conversationContext[recipient].locationReceived = true;
      console.log(`✅ Location received for ${recipient}`);
    }

    if (text.length > 20) {
      conversationContext[recipient].descriptionReceived = true;
      console.log(`✅ Situation description received for ${recipient}`);
    }

    // Handle pending SOS after receiving location
    if (
      conversationContext[recipient].pendingSOS &&
      conversationContext[recipient].locationReceived
    ) {
      console.log("🚨 Completing previously pending SOS...");

      const { latitude, longitude } = extractLatLngFromLocationUrl(text);

      const nearbyContext = await fetchNearbyContext(latitude, longitude);
      const dashboardAlert = buildDashboardAlert(
        user,
        nearbyContext,
        conversationContext[recipient].pendingSOS,
        latitude,
        longitude
      );

      await Promise.all([
        sendMessage("🚨 SOS triggered! Help is on the way.", recipient),
        notifyEmergencyContacts(
          user,
          conversationContext[recipient].pendingSOS
        ),
        axios.post("http://localhost:3002/api/sos-alerts", dashboardAlert),
        prisma.conversationState.upsert({
          where: { phone: recipient },
          update: { state: "resolved" },
          create: { phone: recipient, state: "resolved" },
        }),
      ]);

      delete conversationContext[recipient];
      return res.status(200).send("SOS completed after location received");
    }

    const systemNotes = [];
    if (conversationContext[recipient].locationReceived) {
      systemNotes.push({
        role: "system",
        content: "✅ User has provided a valid location.",
      });
    }
    if (conversationContext[recipient].descriptionReceived) {
      systemNotes.push({
        role: "system",
        content: "✅ User has provided a situation description.",
      });
    }

    const chatHistory = [
      buildSystemPrompt(user),
      ...systemNotes,
      ...(await prisma.chatHistory.findMany({
        where: { phone: recipient },
        orderBy: { createdAt: "asc" },
        take: 20,
      })),
    ];

    const llmResponse = await fetchLLMResponse(
      chatHistory,
      tools,
      fetchNearbyContext
    );

    if (!llmResponse) {
      await sendMessage(
        "❌ Could not process your request. Please try again later.",
        recipient
      );
      return res.status(500).send("LLM processing failed");
    }

    await prisma.chatHistory.create({
      data: { phone: recipient, role: "assistant", content: llmResponse },
    });

    const sosInfo = JSON.parse(llmResponse);

    if (
      sosInfo.ask_for_location &&
      conversationContext[recipient].locationReceived
    ) {
      console.log(
        "⚡ LLM asked for location but already received. Skipping ask."
      );
    } else if (sosInfo.ask_for_location) {
      await sendMessage(
        "📍 Please share your current location (Google/Apple Maps URL).",
        recipient
      );
      return res.status(200).send("Waiting for location");
    } else if (
      sosInfo.ask_for_description &&
      conversationContext[recipient].descriptionReceived
    ) {
      console.log(
        "⚡ LLM asked for description but already received. Skipping ask."
      );
    } else if (sosInfo.ask_for_description) {
      await sendMessage(
        "📝 Please briefly describe your current situation.",
        recipient
      );
      return res.status(200).send("Waiting for description");
    } else if (sosInfo.sos_trigger) {
      const { latitude, longitude } = extractLatLngFromLocationUrl(
        sosInfo.location_url
      );

      if (!latitude || !longitude) {
        console.log(
          "⚡ SOS requested but no valid location provided. Asking for location and saving pending SOS..."
        );
        conversationContext[recipient].pendingSOS = sosInfo;
        await sendMessage(
          "📍 Please share your current location (Google/Apple Maps URL) to proceed with the emergency alert.",
          recipient
        );
        return res
          .status(200)
          .send("Awaiting user location before SOS trigger");
      }

      console.log("🚨 SOS TRIGGERED:", sosInfo);

      const nearbyContext = await fetchNearbyContext(latitude, longitude);
      const dashboardAlert = buildDashboardAlert(
        user,
        nearbyContext,
        sosInfo,
        latitude,
        longitude
      );

      await Promise.all([
        sendMessage("🚨 SOS triggered! Help is on the way.", recipient),
        notifyEmergencyContacts(user, sosInfo),
        axios.post("http://localhost:3002/api/sos-alerts", dashboardAlert),
        prisma.conversationState.upsert({
          where: { phone: recipient },
          update: { state: "resolved" },
          create: { phone: recipient, state: "resolved" },
        }),
      ]);

      delete conversationContext[recipient];
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
      delete conversationContext[recipient];
    }

    res.status(200).send("Processed successfully");
  } catch (error) {
    console.error("❌ Webhook error:", error.message);
    await sendMessage(
      "❌ Unexpected error occurred. Please try again later.",
      recipient
    );
    res.status(500).send("Internal server error");
  } finally {
    processingUsers.delete(recipient);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
