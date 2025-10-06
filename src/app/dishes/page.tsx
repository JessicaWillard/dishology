import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DishClient } from "./client";

export default async function DishesPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return <DishClient userId={userId} />;
}
