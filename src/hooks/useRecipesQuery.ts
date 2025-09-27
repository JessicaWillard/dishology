import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  RecipeWithIngredients,
  RecipeListResponse,
} from "@/utils/types/database";
import {
  fetchRecipes,
  fetchRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  // type CreateRecipeData,
  type UpdateRecipeData,
} from "@/utils/api/recipes";

export const recipeKeys = {
  all: ["recipes"] as const,
  lists: () => [...recipeKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...recipeKeys.lists(), { filters }] as const,
  details: () => [...recipeKeys.all, "detail"] as const,
  detail: (id: string) => [...recipeKeys.details(), id] as const,
};

export function useRecipesQuery() {
  return useQuery({
    queryKey: recipeKeys.lists(),
    queryFn: fetchRecipes,
    select: (data) => data.recipes,
  });
}

export function useRecipeQuery(id: string) {
  return useQuery({
    queryKey: recipeKeys.detail(id),
    queryFn: () => fetchRecipe(id),
    enabled: !!id,
  });
}

export function useCreateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRecipe,
    onMutate: async (newRecipe) => {
      await queryClient.cancelQueries({ queryKey: recipeKeys.lists() });
      const previousRecipes = queryClient.getQueryData(recipeKeys.lists());

      queryClient.setQueryData(
        recipeKeys.lists(),
        (old: RecipeListResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            recipes: [
              {
                id: `temp-${Date.now()}`,
                user_id: "",
                ...newRecipe,
                ingredients: newRecipe.ingredients || [],
                created_at: new Date().toISOString(),
              } as RecipeWithIngredients,
              ...old.recipes,
            ],
          };
        }
      );

      return { previousRecipes };
    },
    onError: (err, newRecipe, context) => {
      if (context?.previousRecipes) {
        queryClient.setQueryData(recipeKeys.lists(), context.previousRecipes);
      }
    },
    onSuccess: (newRecipe) => {
      queryClient.setQueryData(
        recipeKeys.lists(),
        (old: RecipeListResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            recipes: old.recipes
              .map((recipe) =>
                recipe.id?.startsWith("temp-") ? newRecipe : recipe
              )
              .sort((a, b) => a.name.localeCompare(b.name)), // Maintain alphabetical order
          };
        }
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
    },
  });
}

export function useUpdateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRecipeData }) =>
      updateRecipe(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: recipeKeys.lists() });
      const previousRecipes = queryClient.getQueryData(recipeKeys.lists());

      queryClient.setQueryData(
        recipeKeys.lists(),
        (old: RecipeListResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            recipes: old.recipes
              .map((recipe) =>
                recipe.id === id ? { ...recipe, ...data } : recipe
              )
              .sort((a, b) => a.name.localeCompare(b.name)), // Maintain alphabetical order
          };
        }
      );

      return { previousRecipes };
    },
    onError: (err, _variables, context) => {
      if (context?.previousRecipes) {
        queryClient.setQueryData(recipeKeys.lists(), context.previousRecipes);
      }
    },
    onSuccess: (updatedRecipe) => {
      queryClient.setQueryData(
        recipeKeys.lists(),
        (old: RecipeListResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            recipes: old.recipes
              .map((recipe) =>
                recipe.id === updatedRecipe.id ? updatedRecipe : recipe
              )
              .sort((a, b) => a.name.localeCompare(b.name)), // Maintain alphabetical order
          };
        }
      );

      // Also update the detail cache if it exists
      queryClient.setQueryData(
        recipeKeys.detail(updatedRecipe.id),
        updatedRecipe
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
    },
  });
}

export function useDeleteRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRecipe,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: recipeKeys.lists() });
      const previousRecipes = queryClient.getQueryData(recipeKeys.lists());

      queryClient.setQueryData(
        recipeKeys.lists(),
        (old: RecipeListResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            recipes: old.recipes.filter((recipe) => recipe.id !== id),
          };
        }
      );

      return { previousRecipes };
    },
    onError: (err, id, context) => {
      if (context?.previousRecipes) {
        queryClient.setQueryData(recipeKeys.lists(), context.previousRecipes);
      }
    },
    onSuccess: (_, deletedId) => {
      // Remove from detail cache as well
      queryClient.removeQueries({ queryKey: recipeKeys.detail(deletedId) });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
    },
  });
}

export function useRecipes() {
  const recipesQuery = useRecipesQuery();
  const createMutation = useCreateRecipe();
  const updateMutation = useUpdateRecipe();
  const deleteMutation = useDeleteRecipe();

  return {
    recipes: recipesQuery.data || [],
    loading: recipesQuery.isLoading,
    error: recipesQuery.error?.message || null,
    refetch: () => recipesQuery.refetch(),
    create: createMutation.mutateAsync,
    update: (id: string, data: UpdateRecipeData) =>
      updateMutation.mutateAsync({ id, data }),
    remove: async (id: string) => {
      await deleteMutation.mutateAsync(id);
    },
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
