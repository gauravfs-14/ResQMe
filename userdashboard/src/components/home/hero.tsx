/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertCircle, CheckCircle } from "lucide-react";

export function Hero() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this data to your API
    console.log("Sign up with:", { email, phone });
    setSubmitted(true);
    setTimeout(() => {
      setSignupOpen(false);
      setSubmitted(false);
      setEmail("");
      setPhone("");
    }, 2000);
  };

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Emergency Response at Your Fingertips
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Send an SOS text message and get immediate help. Our AI-powered system connects you to emergency services when you need them most.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Dialog open={signupOpen} onOpenChange={setSignupOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" id="signup">Get Started</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  {!submitted ? (
                    <>
                      <DialogHeader>
                        <DialogTitle>Sign Up for SOS Access</DialogTitle>
                        <DialogDescription>
                          Enter your details to create an account and set up emergency contacts.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSignup} className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium leading-none">
                            Email
                          </label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="phone" className="text-sm font-medium leading-none">
                            Phone Number
                          </label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="(555) 123-4567"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full">
                          Create Account
                        </Button>
                      </form>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 space-y-4">
                      <CheckCircle className="h-16 w-16 text-green-500" />
                      <h3 className="text-xl font-semibold">Registration Successful!</h3>
                      <p className="text-center text-muted-foreground">
                        We've sent a confirmation to your email with next steps.
                      </p>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="lg" asChild>
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span>
                Available for Austin residents participating in the safety pilot program
              </span>
            </div>
          </div>
          <div className="mx-auto flex items-center justify-center">
            <div className="relative h-[350px] w-[300px] sm:h-[450px] sm:w-[350px] lg:h-[550px] lg:w-[450px]">
              <div className="absolute right-0 top-0 h-64 w-48 rounded-lg bg-gray-100 p-4 shadow-lg">
                <div className="mb-2 h-6 w-full bg-gray-200 rounded"></div>
                <div className="mb-4 h-24 w-full bg-red-100 rounded flex items-center justify-center">
                  <span className="text-red-600 font-bold text-lg">SOS ALERT</span>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded"></div>
                  <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                  <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 h-72 w-52 rounded-lg bg-white p-4 shadow-lg">
                <div className="mb-2 h-6 w-full bg-gray-100 rounded"></div>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="h-8 w-8 rounded-full bg-green-100"></div>
                    <div className="h-8 w-40 bg-green-50 rounded-xl"></div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <div className="h-8 w-32 bg-blue-50 rounded-xl"></div>
                    <div className="h-8 w-8 rounded-full bg-blue-100"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 w-8 rounded-full bg-green-100"></div>
                    <div className="h-8 w-36 bg-green-50 rounded-xl"></div>
                  </div>
                </div>
                <div className="mt-8 flex items-center gap-2">
                  <div className="h-8 w-full bg-gray-100 rounded-full"></div>
                  <div className="h-8 w-8 rounded-full bg-red-500 flex-shrink-0"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}