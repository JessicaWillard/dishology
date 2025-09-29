import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { RecipeClient } from "./client";

export default async function RecipesPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return <RecipeClient userId={userId} />;
}
