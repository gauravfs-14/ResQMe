import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f8f8f8]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/austin-city-seal.png" alt="City of Austin" className="mx-auto mb-4 h-20" />
          <h1 className="text-3xl font-bold text-[#00437c]">Emergency Profile System</h1>
          <p className="text-gray-600 mt-2">City of Austin, TX</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-[#00437c]">Sign In</CardTitle>
            <CardDescription>Enter your credentials to access your profile</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email
                </Label>
                <Input id="email" type="email" placeholder="your.email@example.com" required className="w-full" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">
                  Password
                </Label>
                <Input id="password" type="password" required className="w-full" />
              </div>

              <Link href="/profile" passHref>
                <Button type="button" className="w-full bg-[#00437c] hover:bg-[#003366]">
                  Sign In
                </Button>
              </Link>
            </form>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="#" className="text-[#00437c] hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
