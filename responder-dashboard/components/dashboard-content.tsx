"use client"

import { useState, useEffect } from "react"
import { useAlerts } from "@/hooks/use-alerts"
import { AlertList } from "@/components/alert-list"
import { AlertDetail } from "@/components/alert-detail"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardStats } from "@/components/dashboard-stats"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Alert } from "@/types/alert"

export function DashboardContent() {
  const { alerts, addAlert, updateAlertStatus } = useAlerts()
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  // Filter alerts based on active tab
  const filteredAlerts = alerts.filter((alert) => {
    if (activeTab === "all") return true
    if (activeTab === "critical") return alert.severityAssessment.severityLevel === "Critical"
    if (activeTab === "high") return alert.severityAssessment.severityLevel === "High"
    if (activeTab === "moderate") return alert.severityAssessment.severityLevel === "Moderate"
    if (activeTab === "low") return alert.severityAssessment.severityLevel === "Low"
    if (activeTab === "pending") return alert.responderStatus.currentStatus === "Pending"
    if (activeTab === "inProgress") return alert.responderStatus.currentStatus === "In Progress"
    if (activeTab === "resolved") return alert.responderStatus.currentStatus === "Resolved"
    return true
  })

  // When an alert is selected, update the selected alert
  const handleSelectAlert = (alert: Alert) => {
    setSelectedAlert(alert)
  }

  // When an alert status is updated, update the alert in the list
  const handleUpdateStatus = (alertId: string, status: string) => {
    updateAlertStatus(alertId, status)
    if (selectedAlert && selectedAlert.alertId === alertId) {
      setSelectedAlert({
        ...selectedAlert,
        responderStatus: {
          ...selectedAlert.responderStatus,
          currentStatus: status,
          lastUpdated: new Date().toISOString(),
        },
      })
    }
  }

  // If a selected alert is updated in the alerts list, update the selected alert
  useEffect(() => {
    if (selectedAlert) {
      const updatedAlert = alerts.find((alert) => alert.alertId === selectedAlert.alertId)
      if (updatedAlert) {
        setSelectedAlert(updatedAlert)
      }
    }
  }, [alerts, selectedAlert])

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader />
      <div className="p-4 md:p-6 flex-1 overflow-hidden">
        <DashboardStats alerts={alerts} />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100%-120px)]">
          <div className="lg:col-span-1 flex flex-col h-full overflow-hidden">
            <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-7 mb-4 overflow-x-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="critical" className="text-red-500">
                  Critical
                </TabsTrigger>
                <TabsTrigger value="high" className="text-orange-500">
                  High
                </TabsTrigger>
                <TabsTrigger value="moderate" className="text-yellow-500">
                  Moderate
                </TabsTrigger>
                <TabsTrigger value="low" className="text-green-500">
                  Low
                </TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="resolved">Resolved</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="h-[calc(100%-40px)] overflow-hidden">
                <AlertList
                  alerts={filteredAlerts}
                  selectedAlertId={selectedAlert?.alertId}
                  onSelectAlert={handleSelectAlert}
                />
              </TabsContent>
              <TabsContent value="critical" className="h-[calc(100%-40px)] overflow-hidden">
                <AlertList
                  alerts={filteredAlerts}
                  selectedAlertId={selectedAlert?.alertId}
                  onSelectAlert={handleSelectAlert}
                />
              </TabsContent>
              <TabsContent value="high" className="h-[calc(100%-40px)] overflow-hidden">
                <AlertList
                  alerts={filteredAlerts}
                  selectedAlertId={selectedAlert?.alertId}
                  onSelectAlert={handleSelectAlert}
                />
              </TabsContent>
              <TabsContent value="moderate" className="h-[calc(100%-40px)] overflow-hidden">
                <AlertList
                  alerts={filteredAlerts}
                  selectedAlertId={selectedAlert?.alertId}
                  onSelectAlert={handleSelectAlert}
                />
              </TabsContent>
              <TabsContent value="low" className="h-[calc(100%-40px)] overflow-hidden">
                <AlertList
                  alerts={filteredAlerts}
                  selectedAlertId={selectedAlert?.alertId}
                  onSelectAlert={handleSelectAlert}
                />
              </TabsContent>
              <TabsContent value="pending" className="h-[calc(100%-40px)] overflow-hidden">
                <AlertList
                  alerts={filteredAlerts}
                  selectedAlertId={selectedAlert?.alertId}
                  onSelectAlert={handleSelectAlert}
                />
              </TabsContent>
              <TabsContent value="resolved" className="h-[calc(100%-40px)] overflow-hidden">
                <AlertList
                  alerts={filteredAlerts}
                  selectedAlertId={selectedAlert?.alertId}
                  onSelectAlert={handleSelectAlert}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-2 h-full overflow-hidden">
            {selectedAlert ? (
              <AlertDetail alert={selectedAlert} onUpdateStatus={handleUpdateStatus} />
            ) : (
              <div className="h-full flex items-center justify-center border rounded-lg bg-muted/20">
                <div className="text-center p-6">
                  <h3 className="text-lg font-medium">No Alert Selected</h3>
                  <p className="text-muted-foreground mt-2">Select an alert from the list to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
