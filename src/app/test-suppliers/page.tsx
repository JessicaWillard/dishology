import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { TestSuppliersClient } from "./client";

/**
 * Test page for supplier form functionality
 * This page requires authentication and handles restaurant setup
 */
export default async function TestSuppliersPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold">Supplier Management Test</h1>
            <p className="text-gray-dark mt-2">
              Test the supplier form and list functionality
            </p>
          </header>

          <TestSuppliersClient userId={userId} />
        </div>
      </div>
    </div>
  );
}
