import Link from "next/link"
import ProfileForm from "@/components/profile-form"
import { ProfileCompleteness } from "@/components/profile-completeness"
import { SkipToContent } from "@/components/skip-to-content"

export default function ProfilePage() {
  // Mock user data - in a real app, this would come from authentication
  const mockUser = {
    firstName: "Jane",
    lastName: "Doe",
    email: "jane.doe@example.com",
  }

  const mockUserId = "user_abc123"

  // Mock profile data for the completeness indicator
  const mockProfile = {
    fullName: "Jane Doe",
    dateOfBirth: "1990-08-15",
    gender: "Female",
    primaryLanguage: "English",
    phone: "+1-512-123-4567",
    email: "jane.doe@example.com",
    emergencyContacts: [
      { name: "John Doe", relation: "Brother", phone: "+1-512-765-4321", email: "john.doe@example.com", priority: 1 },
    ],
    communicationPreferences: {
      preferredMethod: "SMS",
    },
    deviceInfo: {
      deviceType: "iPhone",
    },
  }

  return (
    <>
      <SkipToContent />
      <main className="min-h-screen bg-[#f8f8f8] pb-16">
        <header className="bg-[#00437c] text-white py-4 mb-8" role="banner">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <img src="/austin-logo-white.png" alt="City of Austin" className="h-10" />
                <h1 className="text-xl font-semibold">Emergency Profile System</h1>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm">
                  {mockUser.firstName} {mockUser.lastName}
                </span>
                <Link href="/" className="text-sm underline hover:text-blue-200">
                  Sign out
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4" id="main-content" tabIndex={-1}>
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <ProfileCompleteness profile={mockProfile} />
            </div>

            <h1 className="text-3xl font-bold text-[#00437c] mb-6">Your Emergency Profile</h1>

            <p className="text-gray-600 mb-8">
              Please complete your emergency profile information. This information will be used by emergency services to
              provide better assistance in case of an emergency.
            </p>

            <ProfileForm userId={mockUserId} user={mockUser} />
          </div>
        </div>
      </main>
    </>
  )
}
