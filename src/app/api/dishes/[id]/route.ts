import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceRoleClient } from "@/utils/supabase/server";
import type {
  DishFormData,
  DishIngredientFormData,
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

    const { data: dish, error } = await supabase
      .from("dishes")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching dish:", error);
      return NextResponse.json({ error: "Dish not found" }, { status: 404 });
    }

    // Get ingredients for this dish
    const { data: ingredients, error: ingredientsError } = await supabase
      .from("dish_ingredients")
      .select("id, dish_id, inventory_id, recipe_id, quantity, unit")
      .eq("dish_id", id);

    if (ingredientsError) {
      console.error("Error fetching dish ingredients:", ingredientsError);
      return NextResponse.json(
        { error: "Failed to fetch dish ingredients" },
        { status: 500 }
      );
    }

    // Get inventory data for ingredients
    const inventoryIds =
      ingredients
        ?.map((ing) => ing.inventory_id)
        .filter(Boolean)
        .filter((id): id is string => id !== null) || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let inventoryData: any[] = [];

    if (inventoryIds.length > 0) {
      const { data: inventory, error: inventoryError } = await supabase
        .from("inventory")
        .select("id, name, price_per_unit, type, unit, size")
        .in("id", inventoryIds);

      if (inventoryError) {
        console.error("Error fetching inventory data:", inventoryError);
      } else {
        inventoryData = inventory || [];
      }
    }

    // Get recipe data for ingredients (including their ingredients for cost calculation)
    const recipeIds =
      ingredients
        ?.map((ing) => ing.recipe_id)
        .filter(Boolean)
        .filter((id): id is string => id !== null) || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let recipeData: any[] = [];

    if (recipeIds.length > 0) {
      // First get recipes
      const { data: recipes, error: recipesError } = await supabase
        .from("recipes")
        .select("*")
        .in("id", recipeIds);

      if (recipesError) {
        console.error("Error fetching recipe data:", recipesError);
      } else if (recipes && recipes.length > 0) {
        // Get ingredients for all recipes
        const { data: recipeIngredients, error: recipeIngredientsError } =
          await supabase
            .from("recipe_ingredients")
            .select("id, recipe_id, inventory_id, quantity, unit")
            .in(
              "recipe_id",
              recipes.map((r) => r.id)
            );

        if (recipeIngredientsError) {
          console.error(
            "Error fetching recipe ingredients:",
            recipeIngredientsError
          );
        } else {
          // Get inventory for recipe ingredients
          const recipeInventoryIds =
            recipeIngredients?.map((ing) => ing.inventory_id).filter(Boolean) ||
            [];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let recipeInventoryData: any[] = [];

          if (recipeInventoryIds.length > 0) {
            const { data: recipeInventory, error: recipeInventoryError } =
              await supabase
                .from("inventory")
                .select("id, name, price_per_unit, type, unit, size")
                .in("id", recipeInventoryIds);

            if (recipeInventoryError) {
              console.error(
                "Error fetching recipe inventory data:",
                recipeInventoryError
              );
            } else {
              recipeInventoryData = recipeInventory || [];
            }
          }

          // Combine recipes with their ingredients
          recipeData = recipes.map((recipe) => ({
            ...recipe,
            ingredients: (recipeIngredients || [])
              .filter((ing) => ing.recipe_id === recipe.id)
              .map((ing) => {
                const inventory = recipeInventoryData.find(
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
        }
      }
    }

    const dishWithIngredients = {
      ...dish,
      ingredients: (ingredients || []).map((ing) => {
        const inventory = ing.inventory_id
          ? inventoryData.find((inv) => inv.id === ing.inventory_id)
          : null;
        const recipe = ing.recipe_id
          ? recipeData.find((rec) => rec.id === ing.recipe_id)
          : null;

        return {
          id: ing.id,
          dish_id: ing.dish_id,
          inventory_id: ing.inventory_id,
          recipe_id: ing.recipe_id,
          quantity: ing.quantity,
          unit: ing.unit,
          inventory: inventory || null,
          recipe: recipe || null,
        };
      }),
    };

    return NextResponse.json(dishWithIngredients);
  } catch (error) {
    console.error("GET /api/dishes/[id] error:", error);
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

    // Build update object for dish
    const updateData: Partial<DishFormData> = {};

    if (body.name !== undefined) {
      if (!body.name?.trim()) {
        return NextResponse.json(
          { error: "Dish name cannot be empty" },
          { status: 400 }
        );
      }
      updateData.name = body.name.trim();
    }

    if (body.description !== undefined) {
      updateData.description = body.description?.trim() || null;
    }

    if (body.instructions !== undefined) {
      updateData.instructions = body.instructions?.trim() || null;
    }

    if (body.prep_time !== undefined) {
      updateData.prep_time = body.prep_time?.trim() || null;
    }

    if (body.sell_price !== undefined) {
      if (body.sell_price === null || body.sell_price <= 0) {
        return NextResponse.json(
          { error: "Sell price must be greater than 0" },
          { status: 400 }
        );
      }
      updateData.sell_price = body.sell_price;
    }

    // Update dish
    const { data: dish, error: dishError } = await supabase
      .from("dishes")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (dishError) {
      if (dishError.code === "PGRST116") {
        return NextResponse.json(
          { error: "Dish not found or access denied" },
          { status: 404 }
        );
      }
      console.error("Error updating dish:", dishError);
      return NextResponse.json(
        { error: "Failed to update dish" },
        { status: 500 }
      );
    }

    // Handle ingredients update if provided
    if (body.ingredients !== undefined && Array.isArray(body.ingredients)) {
      // Delete existing ingredients
      const { error: deleteError } = await supabase
        .from("dish_ingredients")
        .delete()
        .eq("dish_id", id);

      if (deleteError) {
        console.error("Error deleting dish ingredients:", deleteError);
        return NextResponse.json(
          { error: "Failed to update dish ingredients" },
          { status: 500 }
        );
      }

      // Insert new ingredients if any
      if (body.ingredients.length > 0) {
        const ingredientsToInsert = body.ingredients.map(
          (ingredient: DishIngredientFormData) => ({
            dish_id: id,
            inventory_id: ingredient.inventory_id || null,
            recipe_id: ingredient.recipe_id || null,
            quantity: ingredient.quantity,
            unit: ingredient.unit?.trim() || null,
          })
        );

        const { error: insertError } = await supabase
          .from("dish_ingredients")
          .insert(ingredientsToInsert);

        if (insertError) {
          console.error("Error inserting dish ingredients:", insertError);
          return NextResponse.json(
            { error: "Failed to update dish ingredients" },
            { status: 500 }
          );
        }
      }
    }

    // Return simplified response (can be enhanced to fetch full data with ingredients)
    return NextResponse.json({ ...dish, ingredients: [] });
  } catch (error) {
    console.error("PUT /api/dishes/[id] error:", error);
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

    // Delete dish ingredients first (foreign key constraint)
    const { error: ingredientsError } = await supabase
      .from("dish_ingredients")
      .delete()
      .eq("dish_id", id);

    if (ingredientsError) {
      console.error("Error deleting dish ingredients:", ingredientsError);
      return NextResponse.json(
        { error: "Failed to delete dish ingredients" },
        { status: 500 }
      );
    }

    // Delete the dish
    const { error: dishError } = await supabase
      .from("dishes")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (dishError) {
      console.error("Error deleting dish:", dishError);
      return NextResponse.json(
        { error: "Failed to delete dish" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/dishes/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
