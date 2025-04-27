// src/components/layout/navbar.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button"; // Add the missing import statement
import { 
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Simulate login/logout (replace with actual auth logic)
  const toggleAuth = () => setIsLoggedIn(!isLoggedIn);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-red-600 text-white p-1 rounded-md">SOS</div>
            <span className="hidden font-bold sm:inline-block">
              Emergency Response
            </span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-primary">
            Home
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-primary">
            About
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:text-primary">
            Contact
          </Link>
          {isLoggedIn && (
            <Link href="/dashboard" className="text-sm font-medium hover:text-primary">
              Dashboard
            </Link>
          )}
        </nav>
        
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Button onClick={toggleAuth} variant="outline">
                Log Out
              </Button>
              <Button asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </>
          ) : (
            <>
              <Button onClick={toggleAuth} variant="outline">
                Log In
              </Button>
              <Button asChild>
                <Link href="#signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
        
        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <nav className="flex flex-col gap-4 mt-8">
              <Link href="/" className="text-sm font-medium hover:text-primary">
                Home
              </Link>
              <Link href="/about" className="text-sm font-medium hover:text-primary">
                About
              </Link>
              <Link href="/contact" className="text-sm font-medium hover:text-primary">
                Contact
              </Link>
              {isLoggedIn && (
                <Link href="/dashboard" className="text-sm font-medium hover:text-primary">
                  Dashboard
                </Link>
              )}
              
              <div className="flex flex-col gap-2 mt-4">
                {isLoggedIn ? (
                  <>
                    <Button onClick={toggleAuth} variant="outline">
                      Log Out
                    </Button>
                    <Button asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={toggleAuth} variant="outline">
                      Log In
                    </Button>
                    <Button asChild>
                      <Link href="#signup">Sign Up</Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}