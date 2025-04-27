# 🚨 ResQMe AI Responder Dashboard & SOS System

An emergency response system built for **RiverHacks 2025**, combining AI triage, real-time location context, and message-based SOS triggering.  
Users can create their profiles via web interface, trigger SOS through **iMessage (LoopMessage)**, and responders can monitor incidents via an intuitive dashboard.

---

## 🛠 Project Overview

This project enables users to pre-create emergency profiles and allows SOS alerts to be triggered quickly using SMS/iMessage. The system:

- Collects user health and emergency details
- Integrates with a backend server to handle incoming SOS triggers
- Fetches nearby hospitals, police stations, fire stations, and weather conditions based on user's live location
- Displays active SOS alerts on a Responder Dashboard
- Uses an LLM-based system for triage suggestions and severity prediction

The goal: **rapid, context-aware emergency assistance with minimal user effort.**

---

## 🧩 Tech Stack

| Layer         | Technology                                   |
| ------------- | -------------------------------------------- |
| Frontend      | Next.js, TailwindCSS, TypeScript             |
| Backend       | Node.js (Express.js), Prisma ORM, TypeScript |
| Database      | PostgreSQL                                   |
| AI/Triage     | Local LLM API (Navigator / Ollama)           |
| Messaging     | LoopMessage (for iMessage/SMS SOS triggers)  |
| Deployment    | Render / Vercel (can be self-hosted too)     |
| External APIs | SERP API (for Nearby Context)                |

---

## 🚀 Features

### 1. Profile Management

- Create and update user profiles with:
  - Medical conditions
  - Emergency contacts
  - Communication preferences
  - Device info
- Consent for live location tracking.

### 2. SOS System

- Trigger SOS via iMessage (LoopMessage).
- Server listens for incoming messages and matches registered users.
- If no location is found, prompts the user to share.

### 3. Responder Dashboard

- Web dashboard listing all active SOS alerts.
- Displays:
  - Severity (Critical, Moderate, Minor)
  - Last known location
  - Profile details
  - Responder status (Accepted / On the way / Resolved)

### 4. Nearby Context Fetching

- Auto-fetch nearby hospitals, police stations, fire stations, and current weather based on user's location.
- Enriches responder decision-making.

### 5. LLM-Based Triage

- Health of LLM API is monitored.
- LLM processes SOS message content to:
  - Predict severity
  - Suggest next best action
  - Provide summary reasoning.

---

Awesome! Here's your **Mini App Connection Diagram** + your earlier **Mini Apps We Built** section — ready for README 🚀:

---

## 🧩 Mini Apps We Built

| App Name                    | Description                                                                                                                                          | Link                                                           |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------- |
| **NearByMe**                | A Node.js app that fetches nearby hospitals, police stations, fire stations, and weather using geolocation and the SERP API.                         | [http://localhost:3232](http://localhost:3232)                 |
| **Responder Dashboard**     | A web-based dashboard for responders to monitor live SOS alerts, view user profiles, and manage response statuses intuitively.                       | [http://localhost:3002/](http://localhost:3002/)               |
| **SOSsystem**               | The core backend system that processes incoming SOS triggers, handles location requests, triages alerts with LLM support, and manages alert routing. | _Runs internally on server_                                    |
| **User Profile**            | A web app for users to create and update their emergency profiles including medical history, emergency contacts, and device information.             | [http://localhost:3000/profile](http://localhost:3000/profile) |
| **WebAI Navigator API**     | A backend system hosting the local LLM model (Navigator/Ollama), providing APIs for AI-powered triage, severity prediction, and emergency reasoning. | [http://localhost:10501](http://localhost:10501)               |
| **LoopMessage SOS Trigger** | External system to trigger SOS by sending a message.                                                                                                 | Send iMessage to: **sandbox.loopmessage.com@imsg.im**          |

---

### 🗺️ Mini Apps Connection Diagram

```
┌─────────────────────┐
│     User Profile     │
│ (Next.js Web App)    │
└─────────┬───────────┘
          │ Profile Created / Updated
          ▼
┌─────────────────────┐        ┌─────────────────────┐
│      SOSsystem       │◀──────│   SOS Trigger via    │
│ (Node.js Backend)    │        │   LoopMessage (iMsg) │
└─────────┬───────────┘        └─────────────────────┘
          │
          ▼
┌─────────────────────┐
│      NearByMe        │
│ (Node.js Mini-App)   │
│ Fetch Nearby Context │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ WebAI Navigator API  │
│ (LLM Triage Engine)  │
│ Severity Prediction  │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  Responder Dashboard │
│ (Next.js Web Frontend)│
│ View & Manage Alerts │
└─────────────────────┘
```

---

## 🌟 Future Work / Extensions

- **End-to-End Encryption:** Secure SOS messages and user profiles.
- **Responder Mobile App:** Lightweight mobile app for responders to get push notifications.
- **Multi-step Triage:** Collect ongoing status updates from the user after SOS.
- **Multi-language Support:** Support for Spanish, Nepali, etc., for broader accessibility.
- **Automated Location Tracking:** Use device sensors/API integration for real-time movement tracking post-SOS.
- **Incident Reporting Analytics:** Post-incident analytics for responders and city authorities.
- **Decentralized Hosting:** Explore using P2P decentralized hosting for critical infrastructure resilience.

---

Would you also like me to give you:

- A `.env.example` template
- Example **User Profile JSON**
- Example **SOS Alert JSON**

??  
If yes, I can append them at the end of this README neatly too! 🚀

Would you like that? (just say: `yes, add env and examples too`) 🔥
