"use client"

import type React from "react"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-1 overflow-auto bg-background text-foreground">{children}</div>
    </div>
  )
}
