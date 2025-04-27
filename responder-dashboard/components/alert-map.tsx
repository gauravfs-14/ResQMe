"use client"

import { useEffect, useRef } from "react"
import { AlertCircle } from "lucide-react"

interface AlertMapProps {
  location: {
    latitude: number
    longitude: number
  }
}

export function AlertMap({ location }: AlertMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapRef.current) return

    // This is a placeholder for a real map implementation
    // In a real application, you would use a mapping library like Leaflet or Google Maps
    const canvas = document.createElement("canvas")
    canvas.width = mapRef.current.clientWidth
    canvas.height = mapRef.current.clientHeight
    mapRef.current.innerHTML = ""
    mapRef.current.appendChild(canvas)

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Draw a more realistic map placeholder
    const drawMap = () => {
      // Background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "#f8fafc")
      gradient.addColorStop(1, "#f1f5f9")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Grid for streets
      ctx.strokeStyle = "#e2e8f0"
      ctx.lineWidth = 1

      // Draw main streets
      for (let i = 0; i < 5; i++) {
        // Horizontal main streets
        ctx.beginPath()
        ctx.moveTo(0, i * (canvas.height / 4))
        ctx.lineTo(canvas.width, i * (canvas.height / 4))
        ctx.stroke()

        // Vertical main streets
        ctx.beginPath()
        ctx.moveTo(i * (canvas.width / 4), 0)
        ctx.lineTo(i * (canvas.width / 4), canvas.height)
        ctx.stroke()
      }

      // Draw smaller streets
      ctx.strokeStyle = "#f1f5f9"
      ctx.lineWidth = 0.5

      for (let i = 0; i < 20; i++) {
        // Horizontal smaller streets
        if (i % 4 !== 0) {
          ctx.beginPath()
          ctx.moveTo(0, i * (canvas.height / 20))
          ctx.lineTo(canvas.width, i * (canvas.height / 20))
          ctx.stroke()
        }

        // Vertical smaller streets
        if (i % 4 !== 0) {
          ctx.beginPath()
          ctx.moveTo(i * (canvas.width / 20), 0)
          ctx.lineTo(i * (canvas.width / 20), canvas.height)
          ctx.stroke()
        }
      }

      // Draw main roads
      ctx.strokeStyle = "#cbd5e1"
      ctx.lineWidth = 6

      // Horizontal main road
      ctx.beginPath()
      ctx.moveTo(0, canvas.height / 2)
      ctx.lineTo(canvas.width, canvas.height / 2)
      ctx.stroke()

      // Vertical main road
      ctx.beginPath()
      ctx.moveTo(canvas.width / 2, 0)
      ctx.lineTo(canvas.width / 2, canvas.height)
      ctx.stroke()

      // Draw some buildings
      ctx.fillStyle = "#e2e8f0"
      for (let i = 0; i < 30; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const size = 5 + Math.random() * 15

        // Skip buildings near the center (where the alert is)
        const distFromCenter = Math.sqrt(Math.pow(x - canvas.width / 2, 2) + Math.pow(y - canvas.height / 2, 2))

        if (distFromCenter > 50) {
          ctx.fillRect(x, y, size, size)
        }
      }

      // Draw the alert location with a pulsing effect
      // Outer glow
      ctx.fillStyle = "rgba(239, 68, 68, 0.2)"
      ctx.beginPath()
      ctx.arc(canvas.width / 2, canvas.height / 2, 40, 0, 2 * Math.PI)
      ctx.fill()

      // Inner circle
      ctx.fillStyle = "#ef4444"
      ctx.beginPath()
      ctx.arc(canvas.width / 2, canvas.height / 2, 8, 0, 2 * Math.PI)
      ctx.fill()

      // Add location text
      ctx.fillStyle = "#1e293b"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(
        `Lat: ${location.latitude.toFixed(6)}, Lng: ${location.longitude.toFixed(6)}`,
        canvas.width / 2,
        canvas.height - 20,
      )
    }

    drawMap()

    // Add a simple animation for the pulsing effect
    let alpha = 0.2
    let increasing = true
    const animate = () => {
      if (increasing) {
        alpha += 0.01
        if (alpha >= 0.3) increasing = false
      } else {
        alpha -= 0.01
        if (alpha <= 0.1) increasing = true
      }

      drawMap()

      // Draw pulsing circle
      ctx.fillStyle = `rgba(239, 68, 68, ${alpha})`
      ctx.beginPath()
      ctx.arc(canvas.width / 2, canvas.height / 2, 30, 0, 2 * Math.PI)
      ctx.fill()

      requestAnimationFrame(animate)
    }

    const animationId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [location])

  return (
    <div className="relative h-full w-full">
      <div ref={mapRef} className="h-full w-full"></div>
      <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded-md text-xs backdrop-blur-sm">
        <AlertCircle className="h-3 w-3 text-red-500" />
        <span>Map placeholder - integrate with a real mapping service in production</span>
      </div>
    </div>
  )
}
