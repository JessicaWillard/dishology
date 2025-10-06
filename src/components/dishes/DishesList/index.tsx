"use client";

import { useMemo } from "react";
import { tv } from "tailwind-variants";
import type { DishesListProps } from "../interface";
import { DishCard } from "../DishCard";
import { Box } from "../../ui/Box";
import { Text } from "../../ui/Text";
import { Icon } from "../../ui/Icon";

const dishesListStyles = tv({
  base: "grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
});

const emptyStateStyles = tv({
  base: "flex flex-col items-center justify-center p-8 gap-4 text-center",
});

interface DishesListComponentProps extends DishesListProps {
  loading?: boolean;
  error?: string | null;
  searchTerm?: string;
}

export function DishesList({
  dishes,
  loading = false,
  error = null,
  searchTerm = "",
  onEdit,
  onIngredientClick,
}: DishesListComponentProps) {
  // Filter and sort dishes alphabetically
  const filteredDishes = useMemo(() => {
    let filtered = dishes;

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (dish) =>
          dish.name.toLowerCase().includes(searchLower) ||
          dish.description?.toLowerCase().includes(searchLower) ||
          dish.ingredients?.some(
            (ingredient) =>
              ("inventory" in ingredient &&
                ingredient.inventory?.name
                  ?.toLowerCase()
                  .includes(searchLower)) ||
              ("recipe" in ingredient &&
                ingredient.recipe?.name?.toLowerCase().includes(searchLower))
          )
      );
    }

    // Sort alphabetically by name
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [dishes, searchTerm]);

  const handleEdit = (dishId: string) => {
    if (onEdit) {
      onEdit(dishId);
    }
  };

  if (loading) {
    return (
      <Box className={emptyStateStyles()}>
        <Icon name="Dish" className="text-gray-400 text-4xl animate-pulse" />
        <Text variant="body" size="lg" className="text-gray-600">
          Loading dishes...
        </Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className={emptyStateStyles()}>
        <Icon name="Warning" className="text-gray-400 text-4xl" />
        <Text variant="body" size="lg" className="text-gray-600">
          Error loading dishes: {error}
        </Text>
      </Box>
    );
  }

  if (filteredDishes.length === 0) {
    const hasSearchTerm = searchTerm.trim().length > 0;

    return (
      <Box className={emptyStateStyles()}>
        <Icon name="Dish" className="text-gray-400 text-4xl" />
        <Text variant="body" size="lg" className="text-gray-600">
          {hasSearchTerm
            ? "No dishes match your search criteria."
            : "No dishes found. Create your first dish to get started."}
        </Text>
      </Box>
    );
  }

  return (
    <Box className={dishesListStyles()}>
      {filteredDishes.map((dish) => (
        <DishCard
          key={dish.id}
          id={dish.id!}
          name={dish.name}
          description={dish.description}
          instructions={dish.instructions}
          prepTime={dish.prep_time}
          sellPrice={dish.sell_price}
          ingredients={dish.ingredients}
          onEdit={handleEdit}
          onIngredientClick={onIngredientClick}
        />
      ))}
    </Box>
  );
}

DishesList.displayName = "DishesList";
