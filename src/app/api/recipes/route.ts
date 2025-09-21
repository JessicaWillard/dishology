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
    const { data: recipes, error } = await supabase
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
      .eq("user_id", userId)
      .order("name", { ascending: true }); // Alphabetical sorting

    if (error) {
      console.error("Error fetching recipes:", error);
      return NextResponse.json(
        { error: "Failed to fetch recipes" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      recipes: recipes || [],
      total: recipes?.length || 0,
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
