// src/app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Shield,
  MessageSquare,
  Clock,
  MapPin,
  Users,
  MessageCircle,
} from "lucide-react";


export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      
      <section className="w-full h-[75vh] bg-gradient-to-b from-rose-50 to-rose-200 dark:from-gray-900 dark:to-rose-950/70 relative">
  <div className="h-full w-full flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto">
    <div className="mb-2 animate-pulse duration-3000">
      <Shield className="h-16 w-16 text-rose-600 dark:text-rose-400 mb-4 mx-auto transform transition-all hover:scale-110 duration-300" />
    </div>
    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-8 text-gray-800 dark:text-white">
      Emergency Help Is Just A Text Away
    </h1>
    <Button size="lg" className="bg-rose-600 hover:bg-rose-700 text-white font-medium px-8 py-6 text-lg" asChild>
      <Link href="/signup">
        Sign Up Now <ArrowRight className="ml-2 h-5 w-5" />
      </Link>
    </Button>
  </div>
  
  {/* Slanted bottom divider */}
  <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
   <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 165"
      preserveAspectRatio="none"
    className="relative block w-full h-10 text-white dark:text-gray-950 transform scale-y-[-2]"
    >
      <path
        d="M1200 120L0 16.48V0h1200v120z"
        fill="currentColor"
      />
    </svg>

</div>
</section>

      {/* How It Works */}
      <section className="w-full py-12 md:py-24 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Simple, Fast, and Reliable
              </h2>
              
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="flex flex-col items-center space-y-2 border-gray-200 p-4 rounded-lg">
              <div className="p-3 rounded-full bg-red-100 text-red-600">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">1. Send a Text</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Simply send message via iMessage to chat with our bots and access our services.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 border-gray-200 p-4 rounded-lg">
              <div className="p-3 rounded-full bg-red-100 text-red-600">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">2. Immediate Response</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Instantly verifies your emergency and dispatches appropriate help.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 border-gray-200 p-4 rounded-lg">
              <div className="p-3 rounded-full bg-red-100 text-red-600">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">3. Help Arrives</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Emergency services guided to your precise location, and your contacts are notified.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="w-full py-12 md:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Key Features
              </h2>
              
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            <div className="flex flex-col space-y-2 p-4">
              <Clock className="h-6 w-6 text-red-600" />
              <h3 className="text-xl font-bold">24/7 Monitoring</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Our service is always on, day or night, weekday or weekend, holiday or not.
              </p>
            </div>
            
            <div className="flex flex-col space-y-2 p-4">
              <Users className="h-6 w-6 text-red-600" />
              <h3 className="text-xl font-bold">Emergency Contact Alerts</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Your designated emergency contacts are automatically notified when you send an SOS.
              </p>
            </div>
            
            <div className="flex flex-col space-y-2 p-4">
              <Shield className="h-6 w-6 text-red-600" />
              <h3 className="text-xl font-bold">Secure & Private</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Your data and information are encrypted and only shared when necessary for your safety.
              </p>
            </div>
            
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {/* <section className="w-full py-12 md:py-24 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Trusted by Thousands
              </h2>
              <p className="max-w-[700px] text-gray-500 dark:text-gray-400 mx-auto">
                See why our users trust SOS Emergency Response to be there when it matters most.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400 italic mb-4">
                "The SOS text service literally saved my life during a hiking accident. 
                Help arrived within minutes after I sent the text."
              </p>
              <div className="font-semibold">Sarah K., Austin</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400 italic mb-4">
                "As a parent of teenagers, this service gives me incredible peace of mind. 
                It's simple enough that my kids actually use it."
              </p>
              <div className="font-semibold">Michael T., Dallas</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400 italic mb-4">
                "I was in a situation where I couldn't make a call, but I could text. 
                This service made all the difference in getting me help quickly."
              </p>
              <div className="font-semibold">Jessica L., Houston</div>
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA */}
      <section className="w-full py-12 md:py-24 bg-red-500 text-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Ready for Peace of Mind?
              </h2>
              <p className="max-w-[700px] mx-auto text-red-100">
                Sign up today and get your first month free. No credit card required.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/signup">
                  Sign Up Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" className="bg-transparent border-white text-white hover:bg-red-600" size="lg" asChild>
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}