// src/app/dashboard/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Bell,
  User,
  
  PhoneCall,
  Clock,
  Activity,
  MapPin,
  AlertTriangle,
  Shield,
  Volume2,
  Smartphone,
} from "lucide-react";

// Note: Next.js metadata must be in a separate layout file for app router in client components
// This won't work in a client component with "use client"

export default function DashboardPage() {
  const [primaryContact, setPrimaryContact] = useState("John Doe");
  const [primaryPhone, setPrimaryPhone] = useState("(512) 555-0187");
  
  // Mock user info
  const user = {
    name: "Sam Rivera",
    email: "sam@example.com",
    phone: "(512) 555-0123",
    address: "1218 West Ave, Austin, TX 78701",
    memberSince: "April 26, 2025",
  };
  
  // Mock alert history
  const alertHistory = [
    {
      id: 1,
      type: "SOS",
      date: "Apr 27, 2025",
      time: "09:23 AM",
      location: "Downtown Austin",
      status: "Resolved",
    },
    {
      id: 2,
      type: "Medical",
      date: "Apr 23, 2025",
      time: "06:45 PM",
      location: "South Congress",
      status: "Resolved",
    },
    {
      id: 3,
      type: "Test",
      date: "Apr 20, 2025",
      time: "11:30 AM",
      location: "Home",
      status: "Test",
    },
  ];

  return (
    <main className="flex-1">
      <div className="container mx-auto p-4 md:p-6 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your emergency settings and contacts.
            </p>
          </div>
          <Button variant="destructive" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Send Test SOS
          </Button>
        </div>
        
        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-3 md:w-1/3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 pt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">SOS Status</CardTitle>
                  <Shield className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold text-green-500">Active</div>
                  <p className="text-xs text-muted-foreground">System is ready to respond</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Response Time</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold">45 seconds</div>
                  <p className="text-xs text-muted-foreground">Average for your area</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Emergency Services</CardTitle>
                  <PhoneCall className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold">3 Available</div>
                  <p className="text-xs text-muted-foreground">Police, Fire, Medical</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Location Status</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold">Accurate</div>
                  <p className="text-xs text-muted-foreground">Last updated 2 minutes ago</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Your Profile</CardTitle>
                  <CardDescription>
                    Personal and emergency information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <User className="h-10 w-10 rounded-full bg-muted p-2" />
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Phone Number</p>
                    <p className="text-sm text-muted-foreground">{user.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Home Address</p>
                    <p className="text-sm text-muted-foreground">{user.address}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Member Since</p>
                    <p className="text-sm text-muted-foreground">{user.memberSince}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Edit Profile</Button>
                </CardFooter>
              </Card>
              
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Alert History</CardTitle>
                  <CardDescription>
                    Your recent emergency alerts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {alertHistory.map((alert) => (
                      <div key={alert.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-md ${
                            alert.type === "SOS" ? "bg-red-100 text-red-600" : 
                            alert.type === "Medical" ? "bg-blue-100 text-blue-600" : 
                            "bg-gray-100 text-gray-600"
                          }`}>
                            <Activity className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{alert.type} Alert</p>
                            <p className="text-xs text-muted-foreground">{alert.date} at {alert.time}</p>
                          </div>
                        </div>
                        <div className="text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            alert.status === "Active" ? "bg-red-100 text-red-600" : 
                            alert.status === "Resolved" ? "bg-green-100 text-green-600" : 
                            "bg-gray-100 text-gray-600"
                          }`}>
                            {alert.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View All Alerts</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          {/* Contacts Tab */}
          <TabsContent value="contacts" className="space-y-4 pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Emergency Contacts</CardTitle>
                <CardDescription>
                  People who will be automatically notified when you send an SOS
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="font-medium">Primary Contact</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm">Name</label>
                      <Input 
                        value={primaryContact} 
                        onChange={(e) => setPrimaryContact(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm">Phone</label>
                      <Input 
                        value={primaryPhone} 
                        onChange={(e) => setPrimaryPhone(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="font-medium">Additional Contacts</div>
                  <div className="grid grid-cols-1 space-y-2">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">Maria Johnson</p>
                        <p className="text-sm text-muted-foreground">(512) 555-0199</p>
                      </div>
                      <Button variant="ghost" size="sm">Remove</Button>
                    </div>
                    <div className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">Robert Chen</p>
                        <p className="text-sm text-muted-foreground">(512) 555-0200</p>
                      </div>
                      <Button variant="ghost" size="sm">Remove</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Add New Contact</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Medical Information</CardTitle>
                <CardDescription>
                  Critical health information that will be shared with emergency responders
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm">Allergies</label>
                  <Input placeholder="e.g., Penicillin, peanuts" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Medical Conditions</label>
                  <Input placeholder="e.g., Diabetes, asthma" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Medications</label>
                  <Input placeholder="e.g., Insulin, albuterol" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Blood Type</label>
                  <Input placeholder="e.g., A+" />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Update Medical Information</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4 pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure how and when you receive alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4" />
                    <div className="text-sm font-medium">Push Notifications</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="push" className="rounded border-gray-300" defaultChecked />
                    <label htmlFor="push" className="text-sm">Enabled</label>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Volume2 className="h-4 w-4" />
                    <div className="text-sm font-medium">Sound Alerts</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="sound" className="rounded border-gray-300" defaultChecked />
                    <label htmlFor="sound" className="text-sm">Enabled</label>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="h-4 w-4" />
                    <div className="text-sm font-medium">SMS Notifications</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="sms" className="rounded border-gray-300" defaultChecked />
                    <label htmlFor="sms" className="text-sm">Enabled</label>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Save Notification Settings</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>SOS Preferences</CardTitle>
                <CardDescription>
                  Customize how your SOS alerts work
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Default SOS Type</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>General Emergency</option>
                    <option>Medical Emergency</option>
                    <option>Safety Threat</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Auto-Activate After</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>10 seconds</option>
                    <option>30 seconds</option>
                    <option>60 seconds</option>
                    <option>Never (Manual only)</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Include Location Data</div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="location" className="rounded border-gray-300" defaultChecked />
                    <label htmlFor="location" className="text-sm">Enabled</label>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Save SOS Preferences</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>
                  Manage your account security options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Change Password</label>
                  <Input type="password" placeholder="Current password" />
                  <Input type="password" placeholder="New password" />
                  <Input type="password" placeholder="Confirm new password" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Two-Factor Authentication</div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="2fa" className="rounded border-gray-300" />
                    <label htmlFor="2fa" className="text-sm">Enable</label>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Log Out of All Devices</Button>
                <Button>Update Security Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}