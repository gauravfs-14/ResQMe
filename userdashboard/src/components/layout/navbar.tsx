"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex-1"></div>
        <nav className="flex items-center space-x-8 flex-auto justify-center">
          <Link
            href="/"
            className={cn(
              "text-sm font-medium transition-colors hover:text-red-600",
              pathname === "/" ? "text-red-600" : "text-muted-foreground",
            )}
          >
            Home
          </Link>
          <Link
            href="/about"
            className={cn(
              "text-sm font-medium transition-colors hover:text-red-600",
              pathname === "/about" ? "text-red-600" : "text-muted-foreground",
            )}
          >
            About
          </Link>
          <Link
            href="/contact"
            className={cn(
              "text-sm font-medium transition-colors hover:text-red-600",
              pathname === "/contact" ? "text-red-600" : "text-muted-foreground",
            )}
          >
            Contact
          </Link>
        </nav>
        <div className="flex-1"></div>
      </div>
    </header>
  )
}
