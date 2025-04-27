export interface Alert {
  alertId: string
  triggerSource: string
  userId: string
  timestamp: string

  location?: {
    latitude: number
    longitude: number
    accuracy: string
    geohash: string | null
  }

  profileSummary: {
    fullName: string
    medicalConditions: string[]
    allergies: string[]
    currentMedications: string[]
    preferredCommunication: string
    emergencyContacts: {
      name: string
      relation: string
      phone: string
      priority: number
    }[]
    additionalNotes: string
  }

  aiGeneratedMessage: string

  severityAssessment: {
    severityLevel: string
    confidenceScore: number
    triageNotes: string
  }

  serpApiContext: {
    liveIncidentsNearby: any[]
    nearbyFacilities: {
      hospitals: {
        name: string
        address: string
        distanceMiles: string
        contactNumber: string
        mapsLink: string
      }[]
      policeStations: {
        name: string
        address: string
        distanceMiles: string
        contactNumber: string
        mapsLink: string
      }[]
      fireStations: {
        name: string
        address: string
        distanceMiles: string
        contactNumber: string
        mapsLink: string
      }[]
    }
    weather: {
      condition?: string
      temperature?: string
      humidity?: string
      windSpeed?: string
      visibility?: string
    }[]
  }

  responderStatus: {
    currentStatus: string
    assignedResponderId: string | null
    fallbackChainTriggered: boolean
    lastUpdated: string
  }
}
