// src/components/home/features.tsx
import { MessageSquare, Shield, Zap, Map, Bell, HeartPulse } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: <MessageSquare className="h-10 w-10 text-primary" />,
      title: "Simple Text Activation",
      description: "Send an SMS with your keyword to instantly trigger emergency protocols."
    },
    {
      icon: <Shield className="h-10 w-10 text-primary" />,
      title: "24/7 Monitoring",
      description: "Our system is always on, ready to respond to your emergency needs anytime."
    },
    {
      icon: <Map className="h-10 w-10 text-primary" />,
      title: "Location Tracking",
      description: "We instantly locate your position to send help exactly where you need it."
    },
    {
      icon: <Bell className="h-10 w-10 text-primary" />,
      title: "Alert Trusted Contacts",
      description: "Automatically notify your emergency contacts when you send an SOS."
    },
    {
      icon: <Zap className="h-10 w-10 text-primary" />,
      title: "Rapid Response",
      description: "Our AI analyzes your situation to dispatch appropriate emergency services."
    },
    {
      icon: <HeartPulse className="h-10 w-10 text-primary" />,
      title: "Health Data Integration",
      description: "Share critical health information with first responders automatically."
    }
  ];

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-slate-50 dark:bg-slate-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm">
              How It Works
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Emergency Response Features
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our system is designed to provide instant help when you need it most.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center space-y-4 rounded-lg border p-4 transition-all hover:bg-muted/50"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-center text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}