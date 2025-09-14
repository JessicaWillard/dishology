import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { InventoryClient } from "./client";

export default async function InventoryPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return <InventoryClient userId={userId} />;
}
