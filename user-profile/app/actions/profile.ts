"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Save Profile Server Action
export async function saveProfile(data: any) {
  console.log("Saving profile data:", data);
  try {
    const {
      id, // optional if you're updating
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
    } = data;

    const savedProfile = await prisma.userProfile.upsert({
      where: { id: id || 0 }, // If id is missing, upsert won't find anything and will CREATE
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
        communicationPreferences: {
          create: communicationPreferences,
        },
        deviceInfo: {
          create: deviceInfo,
        },
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
        email,
        medicalConditions,
        allergies,
        locationTrackingConsent,
        additionalNotes,
        communicationPreferences: {
          update: communicationPreferences,
        },
        deviceInfo: {
          update: deviceInfo,
        },
        currentMedications: {
          deleteMany: {}, // Clear existing meds
          create: currentMedications, // Insert new meds
        },
        emergencyContacts: {
          deleteMany: {}, // Clear existing contacts
          create: emergencyContacts, // Insert new contacts
        },
      },
    });

    console.log("Profile saved:", savedProfile);

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

    console.log("Fetched profile:", profile);

    return profile;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw new Error("Failed to fetch profile. Please try again.");
  }
}
