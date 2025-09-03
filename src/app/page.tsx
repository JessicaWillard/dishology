import Image from "next/image";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { SignedIn, SignedOut, UserProfile } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="font-sans min-h-screen p-8">
      <main className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Welcome to Dishology
          </h1>
          <Text as="h2" size="lg" align="center">
            Your culinary journey starts here
          </Text>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button>Primary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Get Started
            </h2>
            <SignedOut>
              <p className="text-gray-600 mb-4">
                Sign in or create an account to start exploring recipes and
                building your culinary skills.
              </p>
              <div className="space-y-3">
                <p className="text-sm text-gray-500">
                  • Access exclusive recipes
                </p>
                <p className="text-sm text-gray-500">
                  • Save your favorite dishes
                </p>
                <p className="text-sm text-gray-500">
                  • Track your cooking progress
                </p>
              </div>
            </SignedOut>
            <SignedIn>
              <p className="text-green-600 font-medium mb-4">
                ✅ You&apos;re signed in! Welcome back.
              </p>
              <div className="space-y-3">
                <Button variant="solid" href="/suppliers">
                  Manage Suppliers
                </Button>
              </div>
            </SignedIn>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your Profile
            </h2>
            <SignedIn>{/* <UserProfile /> */}</SignedIn>
            <SignedOut>
              <div className="text-center py-8">
                <Image
                  src="/globe.svg"
                  alt="Profile icon"
                  width={64}
                  height={64}
                  className="mx-auto mb-4 opacity-50"
                />
                <p className="text-gray-500">
                  Sign in to view and manage your profile
                </p>
              </div>
            </SignedOut>
          </div>
        </div>

        <div className="mt-12 text-center">
          <SignedIn>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-green-800 mb-2">
                Ready to Cook?
              </h3>
              <p className="text-green-700">
                Explore our recipe collection and start your culinary adventure!
              </p>
            </div>
          </SignedIn>
          <SignedOut>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-blue-800 mb-2">
                Join the Community
              </h3>
              <p className="text-blue-700">
                Create an account to unlock all features and start your cooking
                journey!
              </p>
            </div>
          </SignedOut>
        </div>
      </main>
    </div>
  );
}
