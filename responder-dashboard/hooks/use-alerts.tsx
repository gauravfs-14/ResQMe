"use client"

import { useState, useEffect } from "react"
import type { Alert } from "@/types/alert"

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([])

  // Function to add a new alert
  const addAlert = (alert: Alert) => {
    setAlerts((prevAlerts) => {
      // Check if alert already exists
      const exists = prevAlerts.some((a) => a.alertId === alert.alertId)
      if (exists) {
        // Update existing alert
        return prevAlerts.map((a) => (a.alertId === alert.alertId ? alert : a))
      }
      // Add new alert
      return [alert, ...prevAlerts]
    })
  }

  // Function to update alert status
  const updateAlertStatus = (alertId: string, status: string) => {
    setAlerts((prevAlerts) =>
      prevAlerts.map((alert) =>
        alert.alertId === alertId
          ? {
              ...alert,
              responderStatus: {
                ...alert.responderStatus,
                currentStatus: status,
                lastUpdated: new Date().toISOString(),
              },
            }
          : alert,
      ),
    )
  }

  // Set up API endpoint to receive alerts
  useEffect(() => {
    // Create sample data for demonstration
    const sampleAlerts: Alert[] = [
      {
        alertId: "sos_abc123",
        triggerSource: "LoopMessage",
        userId: "user123",
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
        location: {
          latitude: 37.7749,
          longitude: -122.4194,
          accuracy: "high",
          geohash: null,
        },
        profileSummary: {
          fullName: "Jane Doe",
          medicalConditions: ["Asthma", "Diabetes"],
          allergies: ["Penicillin", "Peanuts"],
          currentMedications: ["Insulin", "Albuterol"],
          preferredCommunication: "Phone",
          emergencyContacts: [
            {
              name: "John Doe",
              relation: "Spouse",
              phone: "555-123-4567",
              priority: 1,
            },
            {
              name: "Mary Smith",
              relation: "Sister",
              phone: "555-987-6543",
              priority: 2,
            },
          ],
          additionalNotes: "Patient has a history of severe asthma attacks.",
        },
        aiGeneratedMessage: "User is experiencing difficulty breathing and chest pain. Possible severe asthma attack.",
        severityAssessment: {
          severityLevel: "Critical",
          confidenceScore: 0.95,
          triageNotes: "Immediate medical attention required. User has history of severe asthma attacks.",
        },
        serpApiContext: {
          liveIncidentsNearby: [],
          nearbyFacilities: {
            hospitals: [
              {
                name: "San Francisco General Hospital",
                address: "1001 Potrero Ave, San Francisco, CA 94110",
                distanceMiles: "1.20",
                contactNumber: "415-206-8000",
                mapsLink: "https://maps.google.com/?q=37.7558,-122.4058",
              },
              {
                name: "UCSF Medical Center",
                address: "505 Parnassus Ave, San Francisco, CA 94143",
                distanceMiles: "2.50",
                contactNumber: "415-476-1000",
                mapsLink: "https://maps.google.com/?q=37.7629,-122.4577",
              },
            ],
            policeStations: [
              {
                name: "Mission Police Station",
                address: "630 Valencia St, San Francisco, CA 94110",
                distanceMiles: "0.80",
                contactNumber: "415-558-5400",
                mapsLink: "https://maps.google.com/?q=37.7638,-122.4220",
              },
            ],
            fireStations: [
              {
                name: "San Francisco Fire Station 7",
                address: "2300 Folsom St, San Francisco, CA 94110",
                distanceMiles: "0.60",
                contactNumber: "415-558-3200",
                mapsLink: "https://maps.google.com/?q=37.7600,-122.4150",
              },
            ],
          },
          weather: [
            {
              condition: "Partly Cloudy",
              temperature: "65°F",
              humidity: "75%",
              windSpeed: "8 mph",
              visibility: "10 miles",
            },
          ],
        },
        responderStatus: {
          currentStatus: "Pending",
          assignedResponderId: null,
          fallbackChainTriggered: false,
          lastUpdated: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        },
      },
      {
        alertId: "sos_def456",
        triggerSource: "LoopMessage",
        userId: "user456",
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
        location: {
          latitude: 37.7833,
          longitude: -122.4167,
          accuracy: "medium",
          geohash: null,
        },
        profileSummary: {
          fullName: "Robert Johnson",
          medicalConditions: ["Epilepsy"],
          allergies: [],
          currentMedications: ["Keppra"],
          preferredCommunication: "Text",
          emergencyContacts: [
            {
              name: "Sarah Johnson",
              relation: "Wife",
              phone: "555-222-3333",
              priority: 1,
            },
          ],
          additionalNotes: "",
        },
        aiGeneratedMessage: "User reports having a seizure 10 minutes ago. Now conscious but disoriented.",
        severityAssessment: {
          severityLevel: "High",
          confidenceScore: 0.88,
          triageNotes: "Post-seizure care needed. Monitor for additional seizures.",
        },
        serpApiContext: {
          liveIncidentsNearby: [],
          nearbyFacilities: {
            hospitals: [
              {
                name: "California Pacific Medical Center",
                address: "2333 Buchanan St, San Francisco, CA 94115",
                distanceMiles: "1.80",
                contactNumber: "415-600-6000",
                mapsLink: "https://maps.google.com/?q=37.7905,-122.4309",
              },
            ],
            policeStations: [],
            fireStations: [],
          },
          weather: [],
        },
        responderStatus: {
          currentStatus: "In Progress",
          assignedResponderId: "resp789",
          fallbackChainTriggered: false,
          lastUpdated: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        },
      },
      {
        alertId: "sos_ghi789",
        triggerSource: "LoopMessage",
        userId: "user789",
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
        location: {
          latitude: 37.79,
          longitude: -122.4,
          accuracy: "high",
          geohash: null,
        },
        profileSummary: {
          fullName: "Michael Smith",
          medicalConditions: [],
          allergies: [],
          currentMedications: [],
          preferredCommunication: "Phone",
          emergencyContacts: [],
          additionalNotes: "",
        },
        aiGeneratedMessage: "User reports minor injury from bicycle accident. Possible sprained ankle.",
        severityAssessment: {
          severityLevel: "Moderate",
          confidenceScore: 0.75,
          triageNotes: "Non-life-threatening injury. Medical evaluation recommended.",
        },
        serpApiContext: {
          liveIncidentsNearby: [],
          nearbyFacilities: {
            hospitals: [],
            policeStations: [],
            fireStations: [],
          },
          weather: [],
        },
        responderStatus: {
          currentStatus: "Resolved",
          assignedResponderId: "resp456",
          fallbackChainTriggered: false,
          lastUpdated: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        },
      },
      {
        alertId: "sos_jkl012",
        triggerSource: "LoopMessage",
        userId: "user012",
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
        location: {
          latitude: 37.78,
          longitude: -122.41,
          accuracy: "high",
          geohash: null,
        },
        profileSummary: {
          fullName: "Emily Wilson",
          medicalConditions: [],
          allergies: [],
          currentMedications: [],
          preferredCommunication: "Email",
          emergencyContacts: [],
          additionalNotes: "",
        },
        aiGeneratedMessage: "User reports feeling dizzy after standing up quickly. No other symptoms.",
        severityAssessment: {
          severityLevel: "Low",
          confidenceScore: 0.82,
          triageNotes: "Likely orthostatic hypotension. Rest and hydration recommended.",
        },
        serpApiContext: {
          liveIncidentsNearby: [],
          nearbyFacilities: {
            hospitals: [],
            policeStations: [],
            fireStations: [],
          },
          weather: [],
        },
        responderStatus: {
          currentStatus: "Resolved",
          assignedResponderId: "resp123",
          fallbackChainTriggered: false,
          lastUpdated: new Date(Date.now() - 1000 * 60 * 100).toISOString(),
        },
      },
    ]

    setAlerts(sampleAlerts)

    // Set up API endpoint to receive alerts
    const setupEndpoint = async () => {
      try {
        const response = await fetch("/api/alerts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ setup: true }),
        })

        if (!response.ok) {
          console.error("Failed to set up alerts endpoint")
        }
      } catch (error) {
        console.error("Error setting up alerts endpoint:", error)
      }
    }

    setupEndpoint()
  }, [])

  return { alerts, addAlert, updateAlertStatus }
}
