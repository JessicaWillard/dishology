import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SuppliersClient } from "./client";

/**
 * Test page for supplier form functionality
 * This page requires authentication and handles restaurant setup
 */
export default async function TestSuppliersPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <SuppliersClient userId={userId} />
        </div>
      </div>
    </div>
  );
}
