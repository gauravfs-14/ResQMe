"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Trash2, Save } from "lucide-react";
import { saveProfile, fetchProfile } from "@/app/actions/profile";

interface ProfileFormProps {
  user: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  // State for form fields
  const [formState, setFormState] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    primaryLanguage: "",
    phone: "",
    email: "",
    medicalConditions: [""],
    allergies: [""],
    currentMedications: [{ name: "", purpose: "", dosage: "" }],
    emergencyContacts: [
      { name: "", relation: "", phone: "", email: "", priority: 1 },
    ],
    communicationPreferences: {
      preferredMethod: "",
      backupMethod: "",
    },
    deviceInfo: {
      deviceType: "",
      usesLoopMessage: false,
    },
    locationTrackingConsent: false,
    additionalNotes: "",
  });

  // Fetch profile data on component mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await fetchProfile(user.email || "");
        if (profile) {
          setFormState({
            fullName: profile.fullName || "",
            dateOfBirth: profile.dateOfBirth || "",
            gender: profile.gender || "",
            primaryLanguage: profile.primaryLanguage || "",
            phone: profile.phone || "",
            email: profile.email || "",
            medicalConditions: profile.medicalConditions || [""],
            allergies: profile.allergies || [""],
            currentMedications: profile.currentMedications || [
              { name: "", purpose: "", dosage: "" },
            ],
            emergencyContacts: profile.emergencyContacts || [
              { name: "", relation: "", phone: "", email: "", priority: 1 },
            ],
            communicationPreferences: profile.communicationPreferences || {
              preferredMethod: "",
              backupMethod: "",
            },
            deviceInfo: profile.deviceInfo || {
              deviceType: "",
              usesLoopMessage: false,
            },
            locationTrackingConsent: profile.locationTrackingConsent || false,
            additionalNotes: profile.additionalNotes || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    loadProfile();
  }, []);

  // Helper function to update form state
  const updateForm = (field: string, value: any) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Add/remove dynamic fields
  const addField = (field: string) => {
    switch (field) {
      case "medicalConditions":
        updateForm("medicalConditions", [...formState.medicalConditions, ""]);
        break;
      case "allergies":
        updateForm("allergies", [...formState.allergies, ""]);
        break;
      case "medications":
        updateForm("currentMedications", [
          ...formState.currentMedications,
          { name: "", purpose: "", dosage: "" },
        ]);
        break;
      case "contacts":
        updateForm("emergencyContacts", [
          ...formState.emergencyContacts,
          {
            name: "",
            relation: "",
            phone: "",
            email: "",
            priority: formState.emergencyContacts.length + 1,
          },
        ]);
        break;
    }
  };

  const removeField = (field: string, index: number) => {
    switch (field) {
      case "medicalConditions":
        updateForm(
          "medicalConditions",
          formState.medicalConditions.filter((_, i) => i !== index)
        );
        break;
      case "allergies":
        updateForm(
          "allergies",
          formState.allergies.filter((_, i) => i !== index)
        );
        break;
      case "medications":
        updateForm(
          "currentMedications",
          formState.currentMedications.filter((_, i) => i !== index)
        );
        break;
      case "contacts":
        updateForm(
          "emergencyContacts",
          formState.emergencyContacts.filter((_, i) => i !== index)
        );
        break;
    }
  };

  const validateForm = () => {
    const requiredFields = [
      formState.fullName,
      formState.dateOfBirth,
      formState.gender,
      formState.primaryLanguage,
      formState.phone,
      formState.email,
      formState.communicationPreferences.preferredMethod,
      formState.communicationPreferences.backupMethod,
    ];

    // Ensure at least one emergency contact is provided
    const hasEmergencyContacts = formState.emergencyContacts.some(
      (contact) =>
        contact.name.trim() !== "" &&
        contact.relation.trim() !== "" &&
        contact.phone.trim() !== ""
    );

    return (
      requiredFields.every((field) => field.trim() !== "") &&
      hasEmergencyContacts
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      alert(
        "Please fill out all required fields, including at least one emergency contact."
      );
      return;
    }

    setIsSubmitting(true);

    saveProfile(formState)
      .then((res) => {
        setSuccess(res.success);
        setTimeout(() => setSuccess(true), 3000);
      })
      .catch((error) => {
        console.error("Error saving profile:", error);
        setSuccess(false);
      });
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {success && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">
            Profile saved successfully!
          </AlertDescription>
        </Alert>
      )}

      <Tabs
        defaultValue="personal"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="medical">Medical Info</TabsTrigger>
          <TabsTrigger value="emergency">Emergency Contacts</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Provide your basic personal information for emergency services.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    value={formState.fullName}
                    onChange={(e) => updateForm("fullName", e.target.value)}
                    placeholder="Jane Marie Doe"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">
                    Date of Birth <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formState.dateOfBirth}
                    onChange={(e) => updateForm("dateOfBirth", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="gender">
                    Gender <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    onValueChange={(value) => updateForm("gender", value)}
                    value={formState.gender}
                    required
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Non-binary">Non-binary</SelectItem>
                      <SelectItem value="Prefer not to say">
                        Prefer not to say
                      </SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primaryLanguage">
                    Primary Language <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      updateForm("primaryLanguage", value)
                    }
                    value={formState.primaryLanguage}
                    required
                  >
                    <SelectTrigger id="primaryLanguage">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                      <SelectItem value="Chinese">Chinese</SelectItem>
                      <SelectItem value="Vietnamese">Vietnamese</SelectItem>
                      <SelectItem value="Korean">Korean</SelectItem>
                      <SelectItem value="Arabic">Arabic</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1-512-123-4567"
                    value={formState.phone}
                    onChange={(e) => updateForm("phone", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formState.email}
                    onChange={(e) => updateForm("email", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <div></div>
                <Button
                  type="button"
                  onClick={() => setActiveTab("medical")}
                  className="bg-[#00437c] hover:bg-[#003366]"
                >
                  Next: Medical Information
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Medical Information Tab */}
        <TabsContent value="medical">
          <Card>
            <CardHeader>
              <CardTitle>Medical Information</CardTitle>
              <CardDescription>
                Provide your medical information to help emergency responders.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Medical Conditions */}
              <div className="space-y-4">
                <Label>Medical Conditions</Label>
                {formState.medicalConditions.map((condition, index) => (
                  <div
                    key={`condition-${index}`}
                    className="flex items-center gap-2"
                  >
                    <Input
                      placeholder="e.g., Epilepsy, Asthma"
                      value={condition}
                      onChange={(e) => {
                        const newConditions = [...formState.medicalConditions];
                        newConditions[index] = e.target.value;
                        updateForm("medicalConditions", newConditions);
                      }}
                      aria-label={`Medical condition ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeField("medicalConditions", index)}
                      aria-label={`Remove medical condition ${index + 1}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addField("medicalConditions")}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" /> Add Condition
                </Button>
              </div>

              {/* Allergies */}
              <div className="space-y-4">
                <Label>Allergies</Label>
                {formState.allergies.map((allergy, index) => (
                  <div
                    key={`allergy-${index}`}
                    className="flex items-center gap-2"
                  >
                    <Input
                      placeholder="e.g., Penicillin, Peanuts"
                      value={allergy}
                      onChange={(e) => {
                        const newAllergies = [...formState.allergies];
                        newAllergies[index] = e.target.value;
                        updateForm("allergies", newAllergies);
                      }}
                      aria-label={`Allergy ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeField("allergies", index)}
                      aria-label={`Remove allergy ${index + 1}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addField("allergies")}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" /> Add Allergy
                </Button>
              </div>

              {/* Current Medications */}
              <div className="space-y-4">
                <Label>Current Medications</Label>
                {formState.currentMedications.map((medication, index) => (
                  <div
                    key={`medication-${index}`}
                    className="space-y-4 p-4 border rounded-md"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Medication {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeField("medications", index)}
                        aria-label={`Remove medication ${index + 1}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`med-name-${index}`}>Name</Label>
                      <Input
                        id={`med-name-${index}`}
                        placeholder="Medication name"
                        value={medication.name}
                        onChange={(e) => {
                          const newMeds = [...formState.currentMedications];
                          newMeds[index].name = e.target.value;
                          updateForm("currentMedications", newMeds);
                        }}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`med-purpose-${index}`}>Purpose</Label>
                      <Input
                        id={`med-purpose-${index}`}
                        placeholder="What is it for?"
                        value={medication.purpose}
                        onChange={(e) => {
                          const newMeds = [...formState.currentMedications];
                          newMeds[index].purpose = e.target.value;
                          updateForm("currentMedications", newMeds);
                        }}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`med-dosage-${index}`}>Dosage</Label>
                      <Input
                        id={`med-dosage-${index}`}
                        placeholder="e.g., 10mg twice daily"
                        value={medication.dosage}
                        onChange={(e) => {
                          const newMeds = [...formState.currentMedications];
                          newMeds[index].dosage = e.target.value;
                          updateForm("currentMedications", newMeds);
                        }}
                      />
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addField("medications")}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" /> Add Medication
                </Button>
              </div>

              {/* Additional Notes */}
              <div className="space-y-2">
                <Label htmlFor="additionalNotes">
                  Additional Medical Notes
                </Label>
                <Textarea
                  id="additionalNotes"
                  placeholder="Any additional information that emergency responders should know"
                  value={formState.additionalNotes}
                  onChange={(e) =>
                    updateForm("additionalNotes", e.target.value)
                  }
                  className="min-h-[100px]"
                />
                <p className="text-sm text-muted-foreground">
                  Include any important medical information not covered above.
                </p>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("personal")}
                >
                  Previous: Personal Information
                </Button>
                <Button
                  type="button"
                  onClick={() => setActiveTab("emergency")}
                  className="bg-[#00437c] hover:bg-[#003366]"
                >
                  Next: Emergency Contacts
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Emergency Contacts Tab */}
        <TabsContent value="emergency">
          <Card>
            <CardHeader>
              <CardTitle>Emergency Contacts</CardTitle>
              <CardDescription>
                Add people who should be contacted in case of an emergency.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {formState.emergencyContacts.map((contact, index) => (
                <div
                  key={`contact-${index}`}
                  className="space-y-4 p-4 border rounded-md"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Contact {index + 1}</h4>
                    {formState.emergencyContacts.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeField("contacts", index)}
                        aria-label={`Remove contact ${index + 1}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`contact-name-${index}`}>
                        Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`contact-name-${index}`}
                        placeholder="Contact name"
                        value={contact.name}
                        onChange={(e) => {
                          const newContacts = [...formState.emergencyContacts];
                          newContacts[index].name = e.target.value;
                          updateForm("emergencyContacts", newContacts);
                        }}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`contact-relation-${index}`}>
                        Relationship <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`contact-relation-${index}`}
                        placeholder="e.g., Parent, Spouse, Friend"
                        value={contact.relation}
                        onChange={(e) => {
                          const newContacts = [...formState.emergencyContacts];
                          newContacts[index].relation = e.target.value;
                          updateForm("emergencyContacts", newContacts);
                        }}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`contact-phone-${index}`}>
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`contact-phone-${index}`}
                        placeholder="+1-512-123-4567"
                        value={contact.phone}
                        onChange={(e) => {
                          const newContacts = [...formState.emergencyContacts];
                          newContacts[index].phone = e.target.value;
                          updateForm("emergencyContacts", newContacts);
                        }}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`contact-email-${index}`}>
                        Email (Optional)
                      </Label>
                      <Input
                        id={`contact-email-${index}`}
                        type="email"
                        placeholder="contact@example.com"
                        value={contact.email}
                        onChange={(e) => {
                          const newContacts = [...formState.emergencyContacts];
                          newContacts[index].email = e.target.value;
                          updateForm("emergencyContacts", newContacts);
                        }}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`contact-priority-${index}`}>
                      Priority (1 = highest)
                    </Label>
                    <Select
                      value={contact.priority.toString()}
                      onValueChange={(value) => {
                        const newContacts = [...formState.emergencyContacts];
                        newContacts[index].priority = Number.parseInt(value);
                        updateForm("emergencyContacts", newContacts);
                      }}
                    >
                      <SelectTrigger id={`contact-priority-${index}`}>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() => addField("contacts")}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" /> Add Contact
              </Button>

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("medical")}
                >
                  Previous: Medical Information
                </Button>
                <Button
                  type="button"
                  onClick={() => setActiveTab("preferences")}
                  className="bg-[#00437c] hover:bg-[#003366]"
                >
                  Next: Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Communication & Device Preferences</CardTitle>
              <CardDescription>
                Set your communication preferences and device information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Communication Preferences */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  Communication Preferences
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="preferredMethod">
                    Preferred Communication Method{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formState.communicationPreferences.preferredMethod}
                    onValueChange={(value) => {
                      const newPrefs = {
                        ...formState.communicationPreferences,
                        preferredMethod: value,
                      };
                      updateForm("communicationPreferences", newPrefs);
                    }}
                    required
                  >
                    <SelectTrigger id="preferredMethod">
                      <SelectValue placeholder="Select preferred method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SMS">SMS</SelectItem>
                      <SelectItem value="iMessage">iMessage</SelectItem>
                      <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                      <SelectItem value="Phone">Phone Call</SelectItem>
                      <SelectItem value="Email">Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backupMethod">
                    Backup Communication Method{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formState.communicationPreferences.backupMethod}
                    onValueChange={(value) => {
                      const newPrefs = {
                        ...formState.communicationPreferences,
                        backupMethod: value,
                      };
                      updateForm("communicationPreferences", newPrefs);
                    }}
                    required
                  >
                    <SelectTrigger id="backupMethod">
                      <SelectValue placeholder="Select backup method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SMS">SMS</SelectItem>
                      <SelectItem value="iMessage">iMessage</SelectItem>
                      <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                      <SelectItem value="Phone">Phone Call</SelectItem>
                      <SelectItem value="Email">Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Device Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Device Information</h3>

                <div className="space-y-2">
                  <Label htmlFor="deviceType">Device Type</Label>
                  <Select
                    value={formState.deviceInfo.deviceType}
                    onValueChange={(value) => {
                      const newDeviceInfo = {
                        ...formState.deviceInfo,
                        deviceType: value,
                      };
                      updateForm("deviceInfo", newDeviceInfo);
                    }}
                  >
                    <SelectTrigger id="deviceType">
                      <SelectValue placeholder="Select device type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="iPhone">iPhone</SelectItem>
                      <SelectItem value="Android">Android</SelectItem>
                      <SelectItem value="iPad">iPad</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="usesLoopMessage"
                    checked={formState.deviceInfo.usesLoopMessage}
                    onCheckedChange={(checked) => {
                      const newDeviceInfo = {
                        ...formState.deviceInfo,
                        usesLoopMessage: checked === true,
                      };
                      updateForm("deviceInfo", newDeviceInfo);
                    }}
                  />
                  <Label
                    htmlFor="usesLoopMessage"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Uses Loop Message
                  </Label>
                </div>
              </div>

              {/* Location Tracking Consent */}
              <div className="space-y-4 pt-4 border-t">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="locationConsent"
                      checked={formState.locationTrackingConsent}
                      onCheckedChange={(checked) => {
                        updateForm("locationTrackingConsent", checked === true);
                      }}
                    />
                    <Label htmlFor="locationConsent" className="font-medium">
                      Location Tracking Consent
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground ml-6">
                    I consent to location tracking for emergency services. This
                    information will only be used in case of an emergency.
                  </p>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("emergency")}
                >
                  Previous: Emergency Contacts
                </Button>
                <div></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/")}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-[#00437c] hover:bg-[#003366]"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving...
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Save className="h-4 w-4" />
              Save Profile
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}
