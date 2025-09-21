import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceRoleClient } from "@/utils/supabase/server";
import type {
  RecipeFormData,
  RecipeIngredientFormData,
} from "@/utils/types/database";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const supabase = await createServiceRoleClient();

    const { data: recipe, error } = await supabase
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
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Recipe not found" },
          { status: 404 }
        );
      }
      console.error("Error fetching recipe:", error);
      return NextResponse.json(
        { error: "Failed to fetch recipe" },
        { status: 500 }
      );
    }

    return NextResponse.json(recipe);
  } catch (error) {
    console.error("GET /api/recipes/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const supabase = await createServiceRoleClient();

    // Build update object for recipe
    const updateData: Partial<RecipeFormData> = {};

    if (body.name !== undefined) {
      if (!body.name?.trim()) {
        return NextResponse.json(
          { error: "Recipe name cannot be empty" },
          { status: 400 }
        );
      }
      updateData.name = body.name.trim();
    }

    if (body.description !== undefined) {
      updateData.description = body.description?.trim() || null;
    }

    if (body.batch_size !== undefined) {
      updateData.batch_size = body.batch_size || null;
    }

    if (body.batch_unit !== undefined) {
      updateData.batch_unit = body.batch_unit?.trim() || null;
    }

    if (body.prep_time !== undefined) {
      updateData.prep_time = body.prep_time?.trim() || null;
    }

    if (body.instructions !== undefined) {
      updateData.instructions = body.instructions?.trim() || null;
    }

    // Update recipe
    const { data: recipe, error: recipeError } = await supabase
      .from("recipes")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (recipeError) {
      if (recipeError.code === "PGRST116") {
        return NextResponse.json(
          { error: "Recipe not found or access denied" },
          { status: 404 }
        );
      }
      console.error("Error updating recipe:", recipeError);
      return NextResponse.json(
        { error: "Failed to update recipe" },
        { status: 500 }
      );
    }

    // Handle ingredients update if provided
    if (body.ingredients !== undefined && Array.isArray(body.ingredients)) {
      // Delete existing ingredients
      const { error: deleteError } = await supabase
        .from("recipe_ingredients")
        .delete()
        .eq("recipe_id", id);

      if (deleteError) {
        console.error("Error deleting recipe ingredients:", deleteError);
        return NextResponse.json(
          { error: "Failed to update recipe ingredients" },
          { status: 500 }
        );
      }

      // Insert new ingredients if any
      if (body.ingredients.length > 0) {
        const ingredientsToInsert = body.ingredients.map(
          (ingredient: RecipeIngredientFormData) => ({
            recipe_id: id,
            inventory_id: ingredient.inventory_id,
            quantity: ingredient.quantity,
            unit: ingredient.unit?.trim() || null,
          })
        );

        const { error: insertError } = await supabase
          .from("recipe_ingredients")
          .insert(ingredientsToInsert);

        if (insertError) {
          console.error("Error inserting recipe ingredients:", insertError);
          return NextResponse.json(
            { error: "Failed to update recipe ingredients" },
            { status: 500 }
          );
        }
      }
    }

    // Fetch the complete updated recipe with ingredients
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
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Error fetching updated recipe:", fetchError);
      return NextResponse.json(recipe);
    }

    return NextResponse.json(completeRecipe);
  } catch (error) {
    console.error("PUT /api/recipes/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const supabase = await createServiceRoleClient();

    // Delete recipe ingredients first (foreign key constraint)
    const { error: ingredientsError } = await supabase
      .from("recipe_ingredients")
      .delete()
      .eq("recipe_id", id);

    if (ingredientsError) {
      console.error("Error deleting recipe ingredients:", ingredientsError);
      return NextResponse.json(
        { error: "Failed to delete recipe ingredients" },
        { status: 500 }
      );
    }

    // Delete the recipe
    const { error: recipeError } = await supabase
      .from("recipes")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (recipeError) {
      console.error("Error deleting recipe:", recipeError);
      return NextResponse.json(
        { error: "Failed to delete recipe" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/recipes/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
