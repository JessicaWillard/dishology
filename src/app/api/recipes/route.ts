import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceRoleClient } from "@/utils/supabase/server";
import type {
  RecipeFormData,
  RecipeIngredientFormData,
  RecipeListResponse,
} from "@/utils/types/database";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createServiceRoleClient();

    // Get all recipes with their ingredients and inventory data
    // First get recipes
    const { data: recipes, error: recipesError } = await supabase
      .from("recipes")
      .select("*")
      .eq("user_id", userId)
      .order("name", { ascending: true });

    if (recipesError) {
      console.error("Error fetching recipes:", recipesError);
      return NextResponse.json(
        { error: "Failed to fetch recipes" },
        { status: 500 }
      );
    }

    // If no recipes, return empty array
    if (!recipes || recipes.length === 0) {
      return NextResponse.json({
        recipes: [],
        total: 0,
      } as RecipeListResponse);
    }

    // Get ingredients for all recipes
    const { data: ingredients, error: ingredientsError } = await supabase
      .from("recipe_ingredients")
      .select("id, recipe_id, inventory_id, quantity, unit")
      .in(
        "recipe_id",
        recipes.map((r) => r.id)
      );

    if (ingredientsError) {
      console.error("Error fetching recipe ingredients:", ingredientsError);
      // Return recipes without ingredients rather than failing completely
      const recipesWithoutIngredients = recipes.map((recipe) => ({
        ...recipe,
        ingredients: [],
      }));

      return NextResponse.json({
        recipes: recipesWithoutIngredients,
        total: recipesWithoutIngredients.length,
      } as RecipeListResponse);
    }

    // Get inventory data for all ingredients
    const inventoryIds =
      ingredients?.map((ing) => ing.inventory_id).filter(Boolean) || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let inventoryData: any[] = [];

    if (inventoryIds.length > 0) {
      const { data: inventory, error: inventoryError } = await supabase
        .from("inventory")
        .select("id, name, price_per_unit, type, unit")
        .in("id", inventoryIds);

      if (inventoryError) {
        console.error("Error fetching inventory data:", inventoryError);
      } else {
        inventoryData = inventory || [];
      }
    }

    const recipesWithIngredients = recipes.map((recipe) => ({
      ...recipe,
      ingredients: (ingredients || [])
        .filter((ing) => ing.recipe_id === recipe.id)
        .map((ing) => {
          const inventory = inventoryData.find(
            (inv) => inv.id === ing.inventory_id
          );
          return {
            id: ing.id,
            recipe_id: ing.recipe_id,
            inventory_id: ing.inventory_id,
            quantity: ing.quantity,
            unit: ing.unit,
            inventory: inventory || null,
          };
        }),
    }));

    return NextResponse.json({
      recipes: recipesWithIngredients || [],
      total: recipesWithIngredients?.length || 0,
    } as RecipeListResponse);
  } catch (error) {
    console.error("GET /api/recipes error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: "Recipe name is required" },
        { status: 400 }
      );
    }

    const supabase = await createServiceRoleClient();

    // Start a transaction by creating the recipe first
    const { data: recipe, error: recipeError } = await supabase
      .from("recipes")
      .insert({
        user_id: userId,
        name: body.name.trim(),
        description: body.description?.trim() || null,
        batch_size: body.batch_size || null,
        batch_unit: body.batch_unit?.trim() || null,
        units: body.units || null,
        prep_time: body.prep_time?.trim() || null,
        instructions: body.instructions?.trim() || null,
      })
      .select()
      .single();

    if (recipeError) {
      console.error("Error creating recipe:", recipeError);
      return NextResponse.json(
        {
          error: "Failed to create recipe",
          details: recipeError.message,
        },
        { status: 500 }
      );
    }

    // Add ingredients if provided
    if (
      body.ingredients &&
      Array.isArray(body.ingredients) &&
      body.ingredients.length > 0
    ) {
      const ingredientsToInsert = body.ingredients.map(
        (ingredient: RecipeIngredientFormData) => ({
          recipe_id: recipe.id,
          inventory_id: ingredient.inventory_id,
          quantity: ingredient.quantity,
          unit: ingredient.unit?.trim() || null,
        })
      );

      const { error: ingredientsError } = await supabase
        .from("recipe_ingredients")
        .insert(ingredientsToInsert);

      if (ingredientsError) {
        console.error("Error creating recipe ingredients:", ingredientsError);
        // Clean up the recipe if ingredients failed
        await supabase.from("recipes").delete().eq("id", recipe.id);
        return NextResponse.json(
          {
            error: "Failed to create recipe ingredients",
            details: ingredientsError.message,
          },
          { status: 500 }
        );
      }
    }

    // Fetch the complete recipe with ingredients
    const { data: completeRecipe, error: fetchError } = await supabase
      .from("recipes")
      .select(
        `
        *,
        recipe_ingredients (
          id,
          quantity,
          unit,
          inventory (
            id,
            name,
            price_per_unit,
            type,
            unit
          )
        )
      `
      )
      .eq("id", recipe.id)
      .single();

    if (fetchError) {
      console.error("Error fetching complete recipe:", fetchError);
      return NextResponse.json(recipe, { status: 201 });
    }

    return NextResponse.json(completeRecipe, { status: 201 });
  } catch (error) {
    console.error("POST /api/recipes error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
