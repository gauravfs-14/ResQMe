// src/app/contact/page.tsx
"use client";

import { useState } from "react";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  AlertCircle, 
  Mail, 
  MapPin, 
  Phone, 
  SendIcon 
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// export const metadata: Metadata = {
//   title: "Contact | SOS Emergency Response",
//   description: "Get in touch with the SOS Emergency Response team.",
// };

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you would send this data to your API
    console.log("Contact form submission:", { name, email, message });
    
    // Simulate successful submission
    setSubmitted(true);
    setError(false);
    
    // Reset form after submission
    setName("");
    setEmail("");
    setMessage("");
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Contact Us
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Have questions about our SOS response service? Our team is here to help.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Form Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Get in Touch
                </h2>
                <p className="text-muted-foreground">
                  Fill out the form and our team will get back to you within 24 hours.
                </p>
              </div>
              
              {submitted && (
                <Alert className="bg-green-50 border-green-500 text-green-800">
                  <AlertCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle>Success!</AlertTitle>
                  <AlertDescription>
                    Your message has been sent. We'll get back to you soon.
                  </AlertDescription>
                </Alert>
              )}
              
              {error && (
                <Alert className="bg-red-50 border-red-500 text-red-800">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    There was a problem sending your message. Please try again.
                  </AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium leading-none">
                    Name
                  </label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium leading-none">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium leading-none">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us how we can help..."
                    className="min-h-32"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  <SendIcon className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </form>
              
              <div className="text-sm text-muted-foreground">
                <p>
                  Note: For emergency assistance, please text SOS to our emergency number directly.
                  This contact form is for general inquiries only.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    Multiple ways to reach our team
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">
                        help@sosemergency.tech
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">
                        (512) 555-0123
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Office</p>
                      <p className="text-sm text-muted-foreground">
                        1218 West Ave, Austin, TX 78701
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Hours of Operation</CardTitle>
                  <CardDescription>
                    Support availability
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Monday - Friday</span>
                      <span className="text-muted-foreground">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Saturday</span>
                      <span className="text-muted-foreground">10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Sunday</span>
                      <span className="text-muted-foreground">Closed</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-bold">Emergency Response:</span> Available 24/7
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQs */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground md:text-xl">
                Common questions about our service
              </p>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-bold">How does the SOS texting service work?</h3>
                <p className="text-muted-foreground">
                  Our service monitors for emergency text messages sent to our dedicated number. When you send an SOS text, our AI analyzes your message, locates your position, and dispatches appropriate emergency services.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Is there a cost to use the service?</h3>
                <p className="text-muted-foreground">
                  The basic SOS service is free for all Austin residents participating in our pilot program. Premium features like additional emergency contacts and health data integration may have associated costs.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">How accurate is the location tracking?</h3>
                <p className="text-muted-foreground">
                  Our location tracking uses a combination of GPS, cell tower triangulation, and address information to provide the most accurate location possible, typically within 10-30 feet of your actual position.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}