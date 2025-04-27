"use client";

import { useState, useEffect } from "react";
import type { Alert } from "@/types/alert";

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Function to add or update a new alert
  const addAlert = (alert: Alert) => {
    setAlerts((prevAlerts) => {
      const exists = prevAlerts.some((a) => a.alertId === alert.alertId);
      if (exists) {
        return prevAlerts.map((a) => (a.alertId === alert.alertId ? alert : a));
      }
      return [alert, ...prevAlerts];
    });
  };

  // Function to update alert status manually
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
          : alert
      )
    );
  };

  useEffect(() => {
    const eventSource = new EventSource("/api/sos-alerts");

    eventSource.onmessage = (event) => {
      const newAlert: Alert = JSON.parse(event.data);
      addAlert(newAlert); // Use addAlert function to add or update the alert
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return { alerts, addAlert, updateAlertStatus };
}
