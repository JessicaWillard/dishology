import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { InventoryClient } from "./client";

export default async function InventoryPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <InventoryClient userId={userId} />
        </div>
      </div>
    </div>
  );
}
