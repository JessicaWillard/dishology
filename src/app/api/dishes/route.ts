import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceRoleClient } from "@/utils/supabase/server";
import type { DishIngredientFormData } from "@/utils/types/database";
import type { DishListResponse } from "@/utils/api/dishes";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createServiceRoleClient();

    // Get all dishes
    const { data: dishes, error: dishesError } = await supabase
      .from("dishes")
      .select("*")
      .eq("user_id", userId)
      .order("name", { ascending: true });

    if (dishesError) {
      console.error("Error fetching dishes:", dishesError);
      return NextResponse.json(
        { error: "Failed to fetch dishes" },
        { status: 500 }
      );
    }

    // If no dishes, return empty array
    if (!dishes || dishes.length === 0) {
      return NextResponse.json({
        dishes: [],
        total: 0,
      } as DishListResponse);
    }

    // Get ingredients for all dishes
    const { data: ingredients, error: ingredientsError } = await supabase
      .from("dish_ingredients")
      .select("id, dish_id, inventory_id, recipe_id, quantity, unit")
      .in(
        "dish_id",
        dishes.map((d) => d.id)
      );

    if (ingredientsError) {
      console.error("Error fetching dish ingredients:", ingredientsError);
      // Return dishes without ingredients rather than failing completely
      const dishesWithoutIngredients = dishes.map((dish) => ({
        ...dish,
        ingredients: [],
      }));

      return NextResponse.json({
        dishes: dishesWithoutIngredients,
        total: dishesWithoutIngredients.length,
      } as DishListResponse);
    }

    // Get inventory data for ingredients that reference inventory
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

    // Get recipe data for ingredients that reference recipes (including their ingredients for cost calculation)
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

    // Combine dishes with ingredients
    const dishesWithIngredients = dishes.map((dish) => ({
      ...dish,
      ingredients: (ingredients || [])
        .filter((ing) => ing.dish_id === dish.id)
        .map((ing) => {
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
    }));

    return NextResponse.json({
      dishes: dishesWithIngredients || [],
      total: dishesWithIngredients?.length || 0,
    } as DishListResponse);
  } catch (error) {
    console.error("GET /api/dishes error:", error);
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
        { error: "Dish name is required" },
        { status: 400 }
      );
    }

    if (
      body.sell_price === undefined ||
      body.sell_price === null ||
      body.sell_price <= 0
    ) {
      return NextResponse.json(
        { error: "Sell price is required and must be greater than 0" },
        { status: 400 }
      );
    }

    const supabase = await createServiceRoleClient();

    // Create the dish
    const { data: dish, error: dishError } = await supabase
      .from("dishes")
      .insert({
        user_id: userId,
        name: body.name.trim(),
        description: body.description?.trim() || null,
        instructions: body.instructions?.trim() || null,
        prep_time: body.prep_time?.trim() || null,
        sell_price: body.sell_price,
      })
      .select()
      .single();

    if (dishError) {
      console.error("Error creating dish:", dishError);
      return NextResponse.json(
        {
          error: "Failed to create dish",
          details: dishError.message,
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
        (ingredient: DishIngredientFormData) => ({
          dish_id: dish.id,
          inventory_id: ingredient.inventory_id || null,
          recipe_id: ingredient.recipe_id || null,
          quantity: ingredient.quantity,
          unit: ingredient.unit?.trim() || null,
        })
      );

      const { error: ingredientsError } = await supabase
        .from("dish_ingredients")
        .insert(ingredientsToInsert);

      if (ingredientsError) {
        console.error("Error creating dish ingredients:", ingredientsError);
        // Clean up the dish if ingredients failed
        await supabase.from("dishes").delete().eq("id", dish.id);
        return NextResponse.json(
          {
            error: "Failed to create dish ingredients",
            details: ingredientsError.message,
          },
          { status: 500 }
        );
      }
    }

    // Fetch the complete dish with ingredients (simplified for now)
    return NextResponse.json({ ...dish, ingredients: [] }, { status: 201 });
  } catch (error) {
    console.error("POST /api/dishes error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
