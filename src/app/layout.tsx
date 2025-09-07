import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { QueryProvider } from "@/providers/QueryProvider";
import "./globals.css";
import Link from "next/link";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dishology",
  description: "Your culinary journey starts here",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        elements: {
          modalBackdrop: "backdrop-blur-sm",
        },
      }}
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
      afterSignOutUrl="/"
    >
      <html lang="en">
        <body className={`${inter.variable} antialiased font-sans`}>
          <header className="border-b border-gray-200 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <Link
                    href="/"
                    className="text-xl font-sans font-semibold text-black"
                  >
                    Dishology
                  </Link>
                </div>
                <div className="flex items-center space-x-4">
                  <SignedOut>
                    <SignInButton mode="modal" forceRedirectUrl="/">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                        Sign In
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal" forceRedirectUrl="/">
                      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                        Sign Up
                      </button>
                    </SignUpButton>
                  </SignedOut>
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                </div>
              </div>
            </div>
          </header>
          <main>
            <QueryProvider>{children}</QueryProvider>
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
