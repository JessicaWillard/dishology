// Simplified restaurant utilities for suppliers_simple table

import { createClient } from "../supabase/server";
import { Restaurant } from "@/utils/types/supplier";

/**
 * Get user's restaurant ID from their profile
 * If user doesn't have a restaurant, create a default one
 */
export async function getUserRestaurantId(userId: string): Promise<string> {
  console.log(
    "getUserRestaurantId - Using simplified approach, returning userId:",
    userId
  );

  // With suppliers_simple table, we use user_id directly instead of restaurant_id
  // This simplifies everything and avoids UUID/RLS issues
  return userId;
}

/**
 * Create a default restaurant for a user and assign it to their profile
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function createDefaultRestaurantForUser(userId: string): Promise<string> {
  console.log("createDefaultRestaurantForUser - Starting for user:", userId);
  const supabase = await createClient();

  // Create a new restaurant
  console.log("createDefaultRestaurantForUser - Creating restaurant...");
  const { data: restaurant, error: restaurantError } = await supabase
    .from("restaurants")
    .insert({
      name: "My Restaurant", // Default name, can be changed later
    })
    .select("id")
    .single();

  if (restaurantError) {
    console.error("Error creating restaurant:", restaurantError);
    throw new Error("Failed to create restaurant");
  }

  // Update user's profile with the new restaurant_id
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ restaurant_id: restaurant.id })
    .eq("id", userId);

  if (updateError) {
    console.error("Error updating user profile:", updateError);
    throw new Error("Failed to assign restaurant to user");
  }

  return restaurant.id;
}

/**
 * Get restaurant details
 */
export async function getRestaurant(restaurantId: string): Promise<Restaurant> {
  const supabase = await createClient();

  const { data: restaurant, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("id", restaurantId)
    .single();

  if (error) {
    console.error("Error fetching restaurant:", error);
    throw new Error("Restaurant not found");
  }

  return restaurant;
}
