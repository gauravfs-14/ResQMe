"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Save Profile Server Action
export async function saveProfile(data: any) {
  console.log("Saving profile data:", data);
  try {
    const cleanedData = cleanProfileData(data); // (use cleaner to remove IDs)

    const {
      fullName,
      dateOfBirth,
      gender,
      primaryLanguage,
      phone,
      email,
      medicalConditions,
      allergies,
      currentMedications,
      emergencyContacts,
      communicationPreferences,
      deviceInfo,
      locationTrackingConsent,
      additionalNotes,
    } = cleanedData;

    const savedProfile = await prisma.userProfile.upsert({
      where: { email }, // ✨ upsert by email only!
      create: {
        fullName,
        dateOfBirth,
        gender,
        primaryLanguage,
        phone,
        email,
        medicalConditions,
        allergies,
        locationTrackingConsent,
        additionalNotes,
        communicationPreferences: communicationPreferences
          ? {
              create: communicationPreferences,
            }
          : undefined,
        deviceInfo: deviceInfo
          ? {
              create: deviceInfo,
            }
          : undefined,
        currentMedications: {
          create: currentMedications,
        },
        emergencyContacts: {
          create: emergencyContacts,
        },
      },
      update: {
        fullName,
        dateOfBirth,
        gender,
        primaryLanguage,
        phone,
        medicalConditions,
        allergies,
        locationTrackingConsent,
        additionalNotes,
        communicationPreferences: communicationPreferences
          ? {
              upsert: {
                update: communicationPreferences,
                create: communicationPreferences,
              },
            }
          : undefined,
        deviceInfo: deviceInfo
          ? {
              upsert: {
                update: deviceInfo,
                create: deviceInfo,
              },
            }
          : undefined,
        currentMedications: {
          deleteMany: {}, // Clear previous
          create: currentMedications,
        },
        emergencyContacts: {
          deleteMany: {}, // Clear previous
          create: emergencyContacts,
        },
      },
    });

    // console.log("Profile saved:", savedProfile);

    revalidatePath("/profile");

    return { success: true };
  } catch (error) {
    console.error("Error saving profile:", error);
    throw new Error("Failed to save profile. Please try again.");
  }
}

// Fetch Profile Server Action
export async function fetchProfile(userEmail: string) {
  try {
    const profile = await prisma.userProfile.findFirst({
      where: { email: userEmail },
      include: {
        communicationPreferences: true,
        deviceInfo: true,
        currentMedications: true,
        emergencyContacts: true,
      },
    });

    return profile;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw new Error("Failed to fetch profile. Please try again.");
  }
}

function cleanProfileData(data: any) {
  const {
    communicationPreferences,
    deviceInfo,
    currentMedications,
    emergencyContacts,
    ...rest
  } = data;

  return {
    ...rest,
    communicationPreferences: communicationPreferences
      ? {
          preferredMethod: communicationPreferences.preferredMethod,
          backupMethod: communicationPreferences.backupMethod,
        }
      : undefined,
    deviceInfo: deviceInfo
      ? {
          deviceType: deviceInfo.deviceType,
          usesLoopMessage: deviceInfo.usesLoopMessage,
        }
      : undefined,
    currentMedications: currentMedications
      ? currentMedications.map((med: any) => ({
          name: med.name,
          purpose: med.purpose,
          dosage: med.dosage,
        }))
      : [],
    emergencyContacts: emergencyContacts
      ? emergencyContacts.map((contact: any) => ({
          name: contact.name,
          relation: contact.relation,
          phone: contact.phone,
          email: contact.email,
          priority: contact.priority,
        }))
      : [],
  };
}
