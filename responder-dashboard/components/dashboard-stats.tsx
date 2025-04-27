import type React from "react"
import { AlertCircle, CheckCircle, Clock, Users } from "lucide-react"
import type { Alert } from "@/types/alert"

interface DashboardStatsProps {
  alerts: Alert[]
}

export function DashboardStats({ alerts }: DashboardStatsProps) {
  // Calculate stats
  const totalAlerts = alerts.length
  const criticalAlerts = alerts.filter((alert) => alert.severityAssessment.severityLevel === "Critical").length
  const pendingAlerts = alerts.filter((alert) => alert.responderStatus.currentStatus === "Pending").length
  const resolvedAlerts = alerts.filter((alert) => alert.responderStatus.currentStatus === "Resolved").length

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Alerts"
        value={totalAlerts}
        icon={<Users className="h-5 w-5" />}
        color="bg-primary/10 text-primary"
        trend={totalAlerts > 0 ? "+5% from yesterday" : "No change"}
      />
      <StatCard
        title="Critical Alerts"
        value={criticalAlerts}
        icon={<AlertCircle className="h-5 w-5" />}
        color="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
        trend={criticalAlerts > 0 ? "Requires immediate attention" : "No critical alerts"}
        trendColor={criticalAlerts > 0 ? "text-red-500" : "text-green-500"}
      />
      <StatCard
        title="Pending Alerts"
        value={pendingAlerts}
        icon={<Clock className="h-5 w-5" />}
        color="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
        trend={pendingAlerts > 0 ? "Awaiting response" : "All alerts handled"}
        trendColor={pendingAlerts > 0 ? "text-yellow-600" : "text-green-500"}
      />
      <StatCard
        title="Resolved Alerts"
        value={resolvedAlerts}
        icon={<CheckCircle className="h-5 w-5" />}
        color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
        trend={`${Math.round((resolvedAlerts / Math.max(totalAlerts, 1)) * 100)}% resolution rate`}
      />
    </div>
  )
}

interface StatCardProps {
  title: string
  value: number
  icon: React.ReactNode
  color: string
  trend?: string
  trendColor?: string
}

function StatCard({ title, value, icon, color, trend, trendColor = "text-muted-foreground" }: StatCardProps) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1 text-card-foreground">{value}</h3>
          {trend && <p className={`text-xs mt-1 ${trendColor}`}>{trend}</p>}
        </div>
        <div className={`rounded-full p-2.5 ${color}`}>{icon}</div>
      </div>
    </div>
  )
}
