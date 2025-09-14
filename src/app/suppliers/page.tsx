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

  return <SuppliersClient userId={userId} />;
}
