import ProfileForm from "@/components/profile-form";
import { SkipToContent } from "@/components/skip-to-content";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const user = await currentUser();
  if (!user) redirect("/");
  // console.log("User data:", user);

  // Mock user data - in a real app, this would come from authentication
  const usr = {
    firstName: `${user?.firstName}`,
    lastName: `${user?.lastName}`,
    email: `${user?.emailAddresses[0]?.emailAddress}`,
  };

  // // Mock profile data for the completeness indicator
  // const profile = {
  //   fullName: `${user?.firstName} ${user?.lastName}`,
  //   email: `${user?.emailAddresses[0]?.emailAddress}`,
  // };

  return (
    <>
      <SkipToContent />
      <main className="min-h-screen bg-[#f8f8f8] pb-16">
        <header className="bg-[#00437c] text-white py-4 mb-8" role="banner">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <img
                  src="/austin-logo-white.png"
                  alt="City of Austin"
                  className="h-10"
                />
                <h1 className="text-xl font-semibold">
                  Emergency Profile System
                </h1>
              </div>
              <div className="flex items-center space-x-2">
                <UserButton />
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4" id="main-content" tabIndex={-1}>
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              {/* <ProfileCompleteness profile={profile} /> */}
            </div>

            <h1 className="text-3xl font-bold text-[#00437c] mb-6">
              Your Emergency Profile
            </h1>

            <p className="text-gray-600 mb-8">
              Please complete your emergency profile information. This
              information will be used by emergency services to provide better
              assistance in case of an emergency.
            </p>

            <ProfileForm user={usr} />
          </div>
        </div>
      </main>
    </>
  );
}
