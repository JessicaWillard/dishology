import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { InventoryClient } from "./client";
import { PageWrapper } from "@/components/ui/PageWrapper";

export default async function InventoryPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return (
    <PageWrapper>
      <InventoryClient userId={userId} />
    </PageWrapper>
  );
}
