"use client"

import { formatDistanceToNow } from "date-fns"
import type { Alert } from "@/types/alert"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface AlertListProps {
  alerts: Alert[]
  selectedAlertId: string | undefined
  onSelectAlert: (alert: Alert) => void
}

export function AlertList({ alerts, selectedAlertId, onSelectAlert }: AlertListProps) {
  // Sort alerts by timestamp (newest first) and then by severity
  const sortedAlerts = [...alerts].sort((a, b) => {
    // First sort by status (Pending first, then In Progress, then Resolved)
    const statusOrder = { Pending: 0, "In Progress": 1, Resolved: 2 }
    const statusA = statusOrder[a.responderStatus.currentStatus as keyof typeof statusOrder] || 3
    const statusB = statusOrder[b.responderStatus.currentStatus as keyof typeof statusOrder] || 3

    if (statusA !== statusB) {
      return statusA - statusB
    }

    // Then sort by severity (Critical first, then High, etc.)
    const severityOrder = { Critical: 0, High: 1, Moderate: 2, Low: 3 }
    const severityA = severityOrder[a.severityAssessment.severityLevel as keyof typeof severityOrder] || 4
    const severityB = severityOrder[b.severityAssessment.severityLevel as keyof typeof severityOrder] || 4

    if (severityA !== severityB) {
      return severityA - severityB
    }

    // Finally sort by timestamp (newest first)
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  })

  return (
    <ScrollArea className="h-full rounded-md border custom-scrollbar">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4 text-foreground">Alerts ({alerts.length})</h2>
        {sortedAlerts.length === 0 ? (
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">No alerts found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedAlerts.map((alert) => (
              <AlertCard
                key={alert.alertId}
                alert={alert}
                isSelected={alert.alertId === selectedAlertId}
                onClick={() => onSelectAlert(alert)}
              />
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  )
}

interface AlertCardProps {
  alert: Alert
  isSelected: boolean
  onClick: () => void
}

function AlertCard({ alert, isSelected, onClick }: AlertCardProps) {
  // Get severity class
  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      case "High":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
      case "Moderate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "Resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  // Format time
  const formatTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
    } catch (error) {
      return "Unknown time"
    }
  }

  // Get alert status indicator
  const getStatusIndicator = (status: string) => {
    switch (status) {
      case "Pending":
        return "animate-pulse-slow bg-yellow-400"
      case "In Progress":
        return "animate-pulse-slow bg-blue-400"
      case "Resolved":
        return "bg-green-400"
      default:
        return "bg-gray-400"
    }
  }

  return (
    <div
      className={cn(
        "rounded-lg border p-3 cursor-pointer transition-all duration-200 hover:shadow-md relative overflow-hidden text-foreground",
        isSelected ? "border-primary bg-primary/5 shadow-sm" : "hover:bg-muted/50",
      )}
      onClick={onClick}
    >
      {/* Status indicator dot */}
      <div
        className={cn("absolute left-0 top-0 bottom-0 w-1", getStatusIndicator(alert.responderStatus.currentStatus))}
      />

      <div className="flex items-start justify-between pl-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden ring-1 ring-border">
            <img
              src={`/placeholder.svg?height=40&width=40&query=person`}
              alt="User avatar"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-medium">{alert.profileSummary.fullName || "Unknown User"}</h3>
            <p className="text-xs text-muted-foreground">{alert.alertId}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge className={getSeverityClass(alert.severityAssessment.severityLevel)}>
            {alert.severityAssessment.severityLevel}
          </Badge>
          <span className="text-xs text-muted-foreground">{formatTime(alert.timestamp)}</span>
        </div>
      </div>
      <div className="mt-2 pl-2">
        <p className="text-sm line-clamp-2">{alert.aiGeneratedMessage}</p>
      </div>
      <div className="mt-2 flex items-center justify-between pl-2">
        <Badge variant="outline" className={getStatusColor(alert.responderStatus.currentStatus)}>
          {alert.responderStatus.currentStatus}
        </Badge>
        {alert.location && (
          <span className="text-xs text-muted-foreground">
            {alert.location.latitude?.toFixed(4)}, {alert.location.longitude?.toFixed(4)}
          </span>
        )}
      </div>
    </div>
  )
}
