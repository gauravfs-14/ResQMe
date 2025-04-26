"use client"

import { useEffect, useState } from "react"

export function SkipToContent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab" && !e.shiftKey) {
        setIsVisible(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <a
      href="#main-content"
      className={`fixed top-4 left-4 z-50 bg-[#00437c] text-white px-4 py-2 rounded focus:outline-none transition-opacity ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onBlur={() => setIsVisible(false)}
    >
      Skip to content
    </a>
  )
}
