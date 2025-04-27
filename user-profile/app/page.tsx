import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignInButton } from "@clerk/nextjs";

export default async function Home() {
  const { userId } = await auth();

  if (userId) redirect("/profile");

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f8f8f8]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src="/austin-city-seal.png"
            alt="City of Austin"
            className="mx-auto mb-4 h-20"
          />
          <h1 className="text-3xl font-bold text-[#00437c]">
            Emergency Profile System
          </h1>
          <p className="text-gray-600 mt-2">City of Austin, TX</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <SignInButton>
              <Button
                type="button"
                className="w-full bg-[#00437c] hover:bg-[#003366]"
              >
                Sign In
              </Button>
            </SignInButton>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
