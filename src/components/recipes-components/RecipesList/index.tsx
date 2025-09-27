"use client";

import { useMemo } from "react";
import { tv } from "tailwind-variants";
import type { RecipesListProps } from "./interface";
import { RecipeCard } from "../RecipeCard";
import { Box } from "../../ui/Box";
import { Text } from "../../ui/Text";
import { Button } from "../../ui/Button";
import { Icon } from "../../ui/Icon";

const recipesListStyles = tv({
  base: "grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
});

const emptyStateStyles = tv({
  base: "flex flex-col items-center justify-center p-8 gap-4 text-center",
});

export function RecipesList({
  recipes,
  loading = false,
  error = null,
  searchTerm = "",
  onEdit,
  onRetry,
  onAddNew,
  onIngredientClick,
  className,
}: RecipesListProps) {
  // Filter and sort recipes alphabetically
  const filteredRecipes = useMemo(() => {
    let filtered = recipes;

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (recipe) =>
          recipe.name.toLowerCase().includes(searchLower) ||
          recipe.description?.toLowerCase().includes(searchLower) ||
          recipe.ingredients?.some((ingredient) =>
            ingredient.inventory.name.toLowerCase().includes(searchLower)
          )
      );
    }

    // Sort alphabetically by name
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [recipes, searchTerm]);

  const handleEdit = (recipeId: string) => {
    const recipe = recipes.find((r) => r.id === recipeId);
    if (recipe && onEdit) {
      onEdit(recipe);
    }
  };

  if (loading) {
    return (
      <Box className={emptyStateStyles()}>
        <Icon name="Recipe" className="text-gray-400 text-4xl animate-pulse" />
        <Text variant="body" size="lg" className="text-gray-600">
          Loading recipes...
        </Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className={emptyStateStyles()}>
        <Icon name="Warning" className="text-gray-400 text-4xl" />
        <Text variant="body" size="lg" className="text-gray-600">
          Error loading recipes: {error}
        </Text>
        {onRetry && (
          <Button variant="solid" handlePress={onRetry}>
            Try Again
          </Button>
        )}
      </Box>
    );
  }

  if (filteredRecipes.length === 0) {
    const hasSearchTerm = searchTerm.trim().length > 0;

    return (
      <Box className={emptyStateStyles()}>
        <Icon name="Recipe" className="text-gray-400 text-4xl" />
        <Text variant="body" size="lg" className="text-gray-600">
          {hasSearchTerm
            ? "No recipes match your search criteria."
            : "No recipes found. Create your first recipe to get started."}
        </Text>
        {!hasSearchTerm && onAddNew && (
          <Button variant="solid" handlePress={onAddNew}>
            Add First Recipe
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Box className={recipesListStyles({ className })}>
      {filteredRecipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          id={recipe.id!}
          name={recipe.name}
          description={recipe.description}
          batchSize={recipe.batch_size}
          batchUnit={recipe.batch_unit}
          units={recipe.units}
          prepTime={recipe.prep_time}
          instructions={recipe.instructions}
          ingredients={recipe.ingredients}
          onEdit={handleEdit}
          onIngredientClick={onIngredientClick}
        />
      ))}
    </Box>
  );
}

RecipesList.displayName = "RecipesList";
