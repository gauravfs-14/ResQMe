"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle, Clock, MapPin, Phone, User } from "lucide-react";
import type { Alert } from "@/types/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { AlertMap } from "@/components/alert-map";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AlertDetailProps {
  alert: Alert;
  onUpdateStatus: (alertId: string, status: string) => void;
}

export function AlertDetail({ alert, onUpdateStatus }: AlertDetailProps) {
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [isResolutionDialogOpen, setIsResolutionDialogOpen] = useState(false);

  // Get severity class
  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "severity-critical";
      case "High":
        return "severity-high";
      case "Moderate":
        return "severity-moderate";
      case "Low":
        return "severity-low";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "Resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  // Format time
  const formatTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return "Unknown time";
    }
  };

  // Handle status update
  const handleStatusUpdate = (status: string) => {
    onUpdateStatus(alert.alertId, status);
  };

  // Handle resolution submit
  const handleResolutionSubmit = () => {
    onUpdateStatus(alert.alertId, "Resolved");
    setIsResolutionDialogOpen(false);
  };

  return (
    <ScrollArea className="h-full rounded-md border custom-scrollbar">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">Alert Details</h2>
            <p className="text-sm text-muted-foreground">
              {alert.alertId} • {formatTime(alert.timestamp)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              className={getSeverityClass(
                alert.severityAssessment.severityLevel
              )}
            >
              {alert.severityAssessment.severityLevel}
            </Badge>
            <Badge
              variant="outline"
              className={getStatusColor(alert.responderStatus.currentStatus)}
            >
              {alert.responderStatus.currentStatus}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full grid grid-cols-4 mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="nearby">Nearby</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-2">
                    <CardTitle>Emergency Information</CardTitle>
                    <CardDescription>
                      Details about the emergency situation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-1">
                          AI Generated Message
                        </h4>
                        <p className="text-sm p-3 bg-muted/50 rounded-md">
                          {alert.aiGeneratedMessage}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">
                          Severity Assessment
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="rounded-md border p-3 hover:bg-muted/30 transition-colors duration-200">
                            <p className="text-xs text-muted-foreground">
                              Severity Level
                            </p>
                            <p className="text-sm font-medium">
                              {alert.severityAssessment.severityLevel}
                            </p>
                          </div>
                          <div className="rounded-md border p-3 hover:bg-muted/30 transition-colors duration-200">
                            <p className="text-xs text-muted-foreground">
                              Confidence Score
                            </p>
                            <p className="text-sm font-medium">
                              {alert.severityAssessment.confidenceScore}
                            </p>
                          </div>
                        </div>
                      </div>
                      {alert.severityAssessment.triageNotes && (
                        <div>
                          <h4 className="text-sm font-medium mb-1">
                            Triage Notes
                          </h4>
                          <p className="text-sm p-3 bg-muted/50 rounded-md">
                            {alert.severityAssessment.triageNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-2">
                    <CardTitle>Responder Status</CardTitle>
                    <CardDescription>
                      Current status and response information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-md border p-3 hover:bg-muted/30 transition-colors duration-200">
                          <p className="text-xs text-muted-foreground">
                            Current Status
                          </p>
                          <p className="text-sm font-medium">
                            {alert.responderStatus.currentStatus}
                          </p>
                        </div>
                        <div className="rounded-md border p-3 hover:bg-muted/30 transition-colors duration-200">
                          <p className="text-xs text-muted-foreground">
                            Last Updated
                          </p>
                          <p className="text-sm font-medium">
                            {formatTime(alert.responderStatus.lastUpdated)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        {alert.responderStatus.currentStatus === "Pending" && (
                          <Button
                            className="w-full"
                            onClick={() => handleStatusUpdate("In Progress")}
                          >
                            <Clock className="mr-2 h-4 w-4" />
                            Mark as In Progress
                          </Button>
                        )}

                        {alert.responderStatus.currentStatus ===
                          "In Progress" && (
                          <Dialog
                            open={isResolutionDialogOpen}
                            onOpenChange={setIsResolutionDialogOpen}
                          >
                            <DialogTrigger asChild>
                              <Button className="w-full">
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Mark as Resolved
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Resolve Alert</DialogTitle>
                                <DialogDescription>
                                  Add resolution notes before marking this alert
                                  as resolved.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="py-4">
                                <Textarea
                                  placeholder="Enter resolution notes..."
                                  value={resolutionNotes}
                                  onChange={(e) =>
                                    setResolutionNotes(e.target.value)
                                  }
                                  className="min-h-[100px]"
                                />
                              </div>
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() =>
                                    setIsResolutionDialogOpen(false)
                                  }
                                >
                                  Cancel
                                </Button>
                                <Button onClick={handleResolutionSubmit}>
                                  Resolve Alert
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}

                        {alert.responderStatus.currentStatus === "Resolved" && (
                          <div className="rounded-md border p-3 bg-green-50 dark:bg-green-900/20">
                            <p className="text-sm font-medium text-green-800 dark:text-green-300 flex items-center">
                              <CheckCircle className="mr-2 h-4 w-4" />
                              This alert has been resolved
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="profile" className="space-y-4">
                <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-2">
                    <CardTitle>User Profile</CardTitle>
                    <CardDescription>
                      Personal and medical information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden ring-1 ring-primary/20">
                          <img
                            src={`/placeholder.svg?height=48&width=48&query=person`}
                            alt="User avatar"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">
                            {alert.profileSummary.fullName || "Unknown User"}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            User ID: {alert.userId}
                          </p>
                        </div>
                      </div>

                      {alert.profileSummary.medicalConditions &&
                        alert.profileSummary.medicalConditions.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium mb-1">
                              Medical Conditions
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {alert.profileSummary.medicalConditions.map(
                                (condition, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="bg-red-50 dark:bg-red-900/20"
                                  >
                                    {condition}
                                  </Badge>
                                )
                              )}
                            </div>
                          </div>
                        )}

                      {alert.profileSummary.allergies &&
                        alert.profileSummary.allergies.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium mb-1">
                              Allergies
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {alert.profileSummary.allergies.map(
                                (allergy, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="bg-orange-50 dark:bg-orange-900/20"
                                  >
                                    {allergy}
                                  </Badge>
                                )
                              )}
                            </div>
                          </div>
                        )}

                      {alert.profileSummary.currentMedications &&
                        alert.profileSummary.currentMedications.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium mb-1">
                              Current Medications
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {alert.profileSummary.currentMedications.map(
                                (medication, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="bg-blue-50 dark:bg-blue-900/20"
                                  >
                                    {medication}
                                  </Badge>
                                )
                              )}
                            </div>
                          </div>
                        )}

                      {alert.profileSummary.additionalNotes && (
                        <div>
                          <h4 className="text-sm font-medium mb-1">
                            Additional Notes
                          </h4>
                          <p className="text-sm p-3 bg-muted/50 rounded-md">
                            {alert.profileSummary.additionalNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-2">
                    <CardTitle>Emergency Contacts</CardTitle>
                    <CardDescription>
                      People to contact in case of emergency
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {alert.profileSummary.emergencyContacts &&
                    alert.profileSummary.emergencyContacts.length > 0 ? (
                      <div className="space-y-3">
                        {alert.profileSummary.emergencyContacts.map(
                          (contact, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between rounded-md border p-3 hover:bg-muted/30 transition-colors duration-200"
                            >
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                  <User className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div>
                                  <p className="font-medium">{contact.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {contact.relation}
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-1"
                              >
                                <Phone className="h-4 w-4" />
                                <span>{contact.phone}</span>
                              </Button>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-20">
                        <p className="text-muted-foreground">
                          No emergency contacts found
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="location" className="space-y-4">
                <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-2">
                    <CardTitle>Location Information</CardTitle>
                    <CardDescription>User's current location</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {alert.location ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="rounded-md border p-3 hover:bg-muted/30 transition-colors duration-200">
                            <p className="text-xs text-muted-foreground">
                              Latitude
                            </p>
                            <p className="text-sm font-medium">
                              {alert.location.latitude}
                            </p>
                          </div>
                          <div className="rounded-md border p-3 hover:bg-muted/30 transition-colors duration-200">
                            <p className="text-xs text-muted-foreground">
                              Longitude
                            </p>
                            <p className="text-sm font-medium">
                              {alert.location.longitude}
                            </p>
                          </div>
                        </div>
                        <div className="rounded-md border p-3 hover:bg-muted/30 transition-colors duration-200">
                          <p className="text-xs text-muted-foreground">
                            Accuracy
                          </p>
                          <p className="text-sm font-medium">
                            {alert.location.accuracy}
                          </p>
                        </div>
                        <div className="h-[300px] rounded-md border overflow-hidden shadow-sm">
                          <AlertMap location={alert.location} />
                        </div>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() =>
                            alert.location &&
                            window.open(
                              `https://maps.google.com/?q=${alert.location.latitude},${alert.location.longitude}`,
                              "_blank"
                            )
                          }
                        >
                          <MapPin className="mr-2 h-4 w-4" />
                          Open in Google Maps
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-40">
                        <p className="text-muted-foreground">
                          No location information available
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="nearby" className="space-y-4">
                <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-2">
                    <CardTitle>Nearby Facilities</CardTitle>
                    <CardDescription>
                      Hospitals, police stations, and fire stations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="hospitals">
                      <TabsList className="grid grid-cols-3 mb-4">
                        <TabsTrigger value="hospitals">Hospitals</TabsTrigger>
                        <TabsTrigger value="police">Police</TabsTrigger>
                        <TabsTrigger value="fire">Fire</TabsTrigger>
                      </TabsList>

                      <TabsContent value="hospitals">
                        {alert.serpApiContext?.nearbyFacilities?.hospitals &&
                        alert.serpApiContext.nearbyFacilities.hospitals.length >
                          0 ? (
                          <div className="space-y-3">
                            {alert.serpApiContext.nearbyFacilities.hospitals.map(
                              (hospital, index) => (
                                <div
                                  key={index}
                                  className="rounded-md border p-3 hover:bg-muted/30 transition-colors duration-200"
                                >
                                  <div className="flex justify-between">
                                    <h4 className="font-medium">
                                      {hospital.name}
                                    </h4>
                                    <Badge variant="outline">
                                      {hospital.distanceMiles} mi
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {hospital.address}
                                  </p>
                                  <div className="mt-2 flex justify-between">
                                    {hospital.contactNumber && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-1"
                                      >
                                        <Phone className="h-4 w-4" />
                                        <span>{hospital.contactNumber}</span>
                                      </Button>
                                    )}
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        window.open(hospital.mapsLink, "_blank")
                                      }
                                    >
                                      <MapPin className="mr-2 h-4 w-4" />
                                      Directions
                                    </Button>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-40">
                            <p className="text-muted-foreground">
                              No nearby hospitals found
                            </p>
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="police">
                        {alert.serpApiContext?.nearbyFacilities
                          ?.policeStations &&
                        alert.serpApiContext.nearbyFacilities.policeStations
                          .length > 0 ? (
                          <div className="space-y-3">
                            {alert.serpApiContext.nearbyFacilities.policeStations.map(
                              (station, index) => (
                                <div
                                  key={index}
                                  className="rounded-md border p-3 hover:bg-muted/30 transition-colors duration-200"
                                >
                                  <div className="flex justify-between">
                                    <h4 className="font-medium">
                                      {station.name}
                                    </h4>
                                    <Badge variant="outline">
                                      {station.distanceMiles} mi
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {station.address}
                                  </p>
                                  <div className="mt-2 flex justify-between">
                                    {station.contactNumber && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-1"
                                      >
                                        <Phone className="h-4 w-4" />
                                        <span>{station.contactNumber}</span>
                                      </Button>
                                    )}
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        window.open(station.mapsLink, "_blank")
                                      }
                                    >
                                      <MapPin className="mr-2 h-4 w-4" />
                                      Directions
                                    </Button>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-40">
                            <p className="text-muted-foreground">
                              No nearby police stations found
                            </p>
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="fire">
                        {alert.serpApiContext?.nearbyFacilities?.fireStations &&
                        alert.serpApiContext.nearbyFacilities.fireStations
                          .length > 0 ? (
                          <div className="space-y-3">
                            {alert.serpApiContext.nearbyFacilities.fireStations.map(
                              (station, index) => (
                                <div
                                  key={index}
                                  className="rounded-md border p-3 hover:bg-muted/30 transition-colors duration-200"
                                >
                                  <div className="flex justify-between">
                                    <h4 className="font-medium">
                                      {station.name}
                                    </h4>
                                    <Badge variant="outline">
                                      {station.distanceMiles} mi
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {station.address}
                                  </p>
                                  <div className="mt-2 flex justify-between">
                                    {station.contactNumber && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-1"
                                      >
                                        <Phone className="h-4 w-4" />
                                        <span>{station.contactNumber}</span>
                                      </Button>
                                    )}
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        window.open(station.mapsLink, "_blank")
                                      }
                                    >
                                      <MapPin className="mr-2 h-4 w-4" />
                                      Directions
                                    </Button>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-40">
                            <p className="text-muted-foreground">
                              No nearby fire stations found
                            </p>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-2">
                    <CardTitle>Weather Conditions</CardTitle>
                    <CardDescription>
                      Current weather at the location
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {alert.serpApiContext?.weather &&
                    alert.serpApiContext.weather.length > 0 ? (
                      <div className="space-y-3">
                        {alert.serpApiContext.weather.map((weather, index) => (
                          <div
                            key={index}
                            className="rounded-md border p-3 hover:bg-muted/30 transition-colors duration-200"
                          >
                            <h4 className="font-medium">
                              {weather.condition || "Current Weather"}
                            </h4>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              {weather.temperature && (
                                <div className="rounded-md border p-2">
                                  <p className="text-xs text-muted-foreground">
                                    Temperature
                                  </p>
                                  <p className="text-sm font-medium">
                                    {weather.temperature}
                                  </p>
                                </div>
                              )}
                              {weather.humidity && (
                                <div className="rounded-md border p-2">
                                  <p className="text-xs text-muted-foreground">
                                    Humidity
                                  </p>
                                  <p className="text-sm font-medium">
                                    {weather.humidity}
                                  </p>
                                </div>
                              )}
                              {weather.windSpeed && (
                                <div className="rounded-md border p-2">
                                  <p className="text-xs text-muted-foreground">
                                    Wind Speed
                                  </p>
                                  <p className="text-sm font-medium">
                                    {weather.windSpeed}
                                  </p>
                                </div>
                              )}
                              {weather.visibility && (
                                <div className="rounded-md border p-2">
                                  <p className="text-xs text-muted-foreground">
                                    Visibility
                                  </p>
                                  <p className="text-sm font-medium">
                                    {weather.visibility}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-40">
                        <p className="text-muted-foreground">
                          No weather information available
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <Card className="h-full shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-2">
                <CardTitle>Alert Timeline</CardTitle>
                <CardDescription>History of alert activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative pl-6 border-l">
                  <div className="space-y-6">
                    <div className="relative">
                      <div className="absolute -left-[25px] h-4 w-4 rounded-full bg-red-500"></div>
                      <div>
                        <p className="font-medium">Alert Created</p>
                        <p className="text-xs text-muted-foreground">
                          {formatTime(alert.timestamp)}
                        </p>
                        <p className="text-sm mt-1">
                          {alert.aiGeneratedMessage}
                        </p>
                      </div>
                    </div>

                    {alert.responderStatus.currentStatus !== "Pending" && (
                      <div className="relative">
                        <div className="absolute -left-[25px] h-4 w-4 rounded-full bg-blue-500"></div>
                        <div>
                          <p className="font-medium">Responder Assigned</p>
                          <p className="text-xs text-muted-foreground">
                            {formatTime(alert.responderStatus.lastUpdated)}
                          </p>
                          <p className="text-sm mt-1">
                            Alert status changed to In Progress
                          </p>
                        </div>
                      </div>
                    )}

                    {alert.responderStatus.currentStatus === "Resolved" && (
                      <div className="relative">
                        <div className="absolute -left-[25px] h-4 w-4 rounded-full bg-green-500"></div>
                        <div>
                          <p className="font-medium">Alert Resolved</p>
                          <p className="text-xs text-muted-foreground">
                            {formatTime(alert.responderStatus.lastUpdated)}
                          </p>
                          <p className="text-sm mt-1">
                            Emergency situation has been resolved
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
