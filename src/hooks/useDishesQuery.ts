import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { DishWithIngredients } from "@/utils/types/database";
import {
  fetchDishes,
  fetchDish,
  createDish,
  updateDish,
  deleteDish,
  type UpdateDishData,
  type DishListResponse,
} from "@/utils/api/dishes";

export const dishKeys = {
  all: ["dishes"] as const,
  lists: () => [...dishKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...dishKeys.lists(), { filters }] as const,
  details: () => [...dishKeys.all, "detail"] as const,
  detail: (id: string) => [...dishKeys.details(), id] as const,
};

export function useDishesQuery() {
  return useQuery({
    queryKey: dishKeys.lists(),
    queryFn: fetchDishes,
    select: (data) => data.dishes,
  });
}

export function useDishQuery(id: string) {
  return useQuery({
    queryKey: dishKeys.detail(id),
    queryFn: () => fetchDish(id),
    enabled: !!id,
  });
}

export function useCreateDish() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDish,
    onMutate: async (newDish) => {
      await queryClient.cancelQueries({ queryKey: dishKeys.lists() });
      const previousDishes = queryClient.getQueryData(dishKeys.lists());

      queryClient.setQueryData(
        dishKeys.lists(),
        (old: DishListResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            dishes: [
              {
                id: `temp-${Date.now()}`,
                user_id: "",
                ...newDish,
                ingredients: newDish.ingredients || [],
                created_at: new Date().toISOString(),
              } as DishWithIngredients,
              ...old.dishes,
            ],
          };
        }
      );

      return { previousDishes };
    },
    onError: (err, newDish, context) => {
      if (context?.previousDishes) {
        queryClient.setQueryData(dishKeys.lists(), context.previousDishes);
      }
    },
    onSuccess: (newDish) => {
      queryClient.setQueryData(
        dishKeys.lists(),
        (old: DishListResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            dishes: old.dishes
              .map((dish) => (dish.id?.startsWith("temp-") ? newDish : dish))
              .sort((a, b) => a.name.localeCompare(b.name)), // Maintain alphabetical order
          };
        }
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: dishKeys.lists() });
    },
  });
}

export function useUpdateDish() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDishData }) =>
      updateDish(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: dishKeys.lists() });
      const previousDishes = queryClient.getQueryData(dishKeys.lists());

      // Only perform optimistic update for basic dish fields, not ingredients
      queryClient.setQueryData(
        dishKeys.lists(),
        (old: DishListResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            dishes: old.dishes
              .map((dish) => {
                if (dish.id === id) {
                  // Only update basic dish fields, preserve existing ingredients structure
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  const { ingredients, ...dishFields } = data;
                  return { ...dish, ...dishFields };
                }
                return dish;
              })
              .sort((a, b) => a.name.localeCompare(b.name)), // Maintain alphabetical order
          };
        }
      );

      return { previousDishes };
    },
    onError: (err, _variables, context) => {
      if (context?.previousDishes) {
        queryClient.setQueryData(dishKeys.lists(), context.previousDishes);
      }
    },
    onSuccess: (updatedDish) => {
      queryClient.setQueryData(
        dishKeys.lists(),
        (old: DishListResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            dishes: old.dishes
              .map((dish) => (dish.id === updatedDish.id ? updatedDish : dish))
              .sort((a, b) => a.name.localeCompare(b.name)), // Maintain alphabetical order
          };
        }
      );

      // Also update the detail cache if it exists
      queryClient.setQueryData(dishKeys.detail(updatedDish.id), updatedDish);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: dishKeys.lists() });
    },
  });
}

export function useDeleteDish() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDish,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: dishKeys.lists() });
      const previousDishes = queryClient.getQueryData(dishKeys.lists());

      queryClient.setQueryData(
        dishKeys.lists(),
        (old: DishListResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            dishes: old.dishes.filter((dish) => dish.id !== id),
          };
        }
      );

      return { previousDishes };
    },
    onError: (err, id, context) => {
      if (context?.previousDishes) {
        queryClient.setQueryData(dishKeys.lists(), context.previousDishes);
      }
    },
    onSuccess: (_, deletedId) => {
      // Remove from detail cache as well
      queryClient.removeQueries({ queryKey: dishKeys.detail(deletedId) });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: dishKeys.lists() });
    },
  });
}

export function useDishes() {
  const dishesQuery = useDishesQuery();
  const createMutation = useCreateDish();
  const updateMutation = useUpdateDish();
  const deleteMutation = useDeleteDish();

  return {
    dishes: dishesQuery.data || [],
    loading: dishesQuery.isLoading,
    error: dishesQuery.error?.message || null,
    refetch: () => dishesQuery.refetch(),
    create: createMutation.mutateAsync,
    update: (id: string, data: UpdateDishData) =>
      updateMutation.mutateAsync({ id, data }),
    remove: async (id: string) => {
      await deleteMutation.mutateAsync(id);
    },
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
