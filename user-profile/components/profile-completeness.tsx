"use client"

import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, AlertCircle } from "lucide-react"

interface ProfileCompletenessProps {
  profile: any
}

export function ProfileCompleteness({ profile }: ProfileCompletenessProps) {
  // Calculate completeness percentage based on filled fields
  const calculateCompleteness = () => {
    if (!profile) return 0

    const requiredFields = ["fullName", "dateOfBirth", "gender", "primaryLanguage", "phone", "email"]

    const requiredArrays = [{ key: "emergencyContacts", minLength: 1 }]

    const requiredNestedFields = [
      { path: "communicationPreferences.preferredMethod" },
      { path: "deviceInfo.deviceType" },
    ]

    let completedCount = 0
    const totalCount = requiredFields.length + requiredArrays.length + requiredNestedFields.length

    // Check required fields
    requiredFields.forEach((field) => {
      if (profile[field] && profile[field].toString().trim() !== "") {
        completedCount++
      }
    })

    // Check required arrays
    requiredArrays.forEach(({ key, minLength }) => {
      if (
        Array.isArray(profile[key]) &&
        profile[key].length >= minLength &&
        profile[key].every((item: any) => Object.values(item).some((val: any) => val && val.toString().trim() !== ""))
      ) {
        completedCount++
      }
    })

    // Check nested fields
    requiredNestedFields.forEach(({ path }) => {
      const pathParts = path.split(".")
      let value = profile
      for (const part of pathParts) {
        value = value?.[part]
      }
      if (value && value.toString().trim() !== "") {
        completedCount++
      }
    })

    return Math.round((completedCount / totalCount) * 100)
  }

  const completeness = calculateCompleteness()

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          Profile Completeness
          {completeness === 100 ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <AlertCircle className="h-5 w-5 text-amber-500" />
          )}
        </CardTitle>
        <CardDescription>Complete your profile to help emergency responders</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Progress value={completeness} className="h-2" />
          <p className="text-sm text-right font-medium">{completeness}% Complete</p>
        </div>
      </CardContent>
    </Card>
  )
}
