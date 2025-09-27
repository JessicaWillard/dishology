import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  InventoryFormData,
  InventoryListResponse,
} from "@/utils/types/database";
import {
  fetchInventory,
  fetchInventoryItem,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} from "@/utils/api/inventory";
import { recipeKeys } from "./useRecipesQuery";

export const inventoryKeys = {
  all: ["inventory"] as const,
  lists: () => [...inventoryKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...inventoryKeys.lists(), { filters }] as const,
  details: () => [...inventoryKeys.all, "detail"] as const,
  detail: (id: string) => [...inventoryKeys.details(), id] as const,
};

export function useInventoryQuery() {
  return useQuery({
    queryKey: inventoryKeys.lists(),
    queryFn: fetchInventory,
    select: (data) => data.inventory,
  });
}

export function useInventoryItemQuery(id: string) {
  return useQuery({
    queryKey: inventoryKeys.detail(id),
    queryFn: () => fetchInventoryItem(id),
    enabled: !!id,
  });
}

export function useCreateInventory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInventoryItem,
    onMutate: async (newInventory) => {
      await queryClient.cancelQueries({ queryKey: inventoryKeys.lists() });
      const previousInventory = queryClient.getQueryData(inventoryKeys.lists());

      queryClient.setQueryData(
        inventoryKeys.lists(),
        (old: InventoryListResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            inventory: [
              {
                id: `temp-${old.inventory.length}`,
                user_id: "",
                name: newInventory.name,
                type: newInventory.type,
                description: newInventory.description || null,
                quantity: newInventory.quantity,
                size: newInventory.size || null,
                unit: newInventory.unit || null,
                price_per_unit: newInventory.price_per_unit,
                price_per_pack: newInventory.price_per_pack || null,
                supplier_id: newInventory.supplier_id || null,
                location: newInventory.location || null,
                min_count: newInventory.min_count || null,
                count_date: newInventory.count_date,
                created_at: new Date().toISOString(),
              },
              ...old.inventory,
            ],
          };
        }
      );

      return { previousInventory };
    },
    onError: (err, newInventory, context) => {
      if (context?.previousInventory) {
        queryClient.setQueryData(
          inventoryKeys.lists(),
          context.previousInventory
        );
      }
    },
    onSuccess: (newInventory) => {
      queryClient.setQueryData(
        inventoryKeys.lists(),
        (old: InventoryListResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            inventory: old.inventory.map((item) =>
              item.id?.startsWith("temp-") ? newInventory : item
            ),
          };
        }
      );

      // Invalidate recipe queries since recipes may reference new inventory
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: recipeKeys.details() });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
    },
  });
}

export function useUpdateInventory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<InventoryFormData>;
    }) => updateInventoryItem(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: inventoryKeys.lists() });
      const previousInventory = queryClient.getQueryData(inventoryKeys.lists());

      queryClient.setQueryData(
        inventoryKeys.lists(),
        (old: InventoryListResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            inventory: old.inventory.map((item) =>
              item.id === id ? { ...item, ...data } : item
            ),
          };
        }
      );

      return { previousInventory };
    },
    onError: (err, _variables, context) => {
      if (context?.previousInventory) {
        queryClient.setQueryData(
          inventoryKeys.lists(),
          context.previousInventory
        );
      }
    },
    onSuccess: (updatedInventory) => {
      // Update the specific item with the API response
      queryClient.setQueryData(
        inventoryKeys.lists(),
        (old: InventoryListResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            inventory: old.inventory.map((item) =>
              item.id === updatedInventory.id ? updatedInventory : item
            ),
          };
        }
      );

      // Invalidate recipe queries since recipes contain inventory data
      // This ensures recipe ingredient tables show updated inventory information
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: recipeKeys.details() });
    },
    onSettled: () => {
      // Don't invalidate inventory immediately to prevent race conditions
      // The onSuccess callback already handles updating with the correct data
      // queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
    },
  });
}

export function useDeleteInventory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteInventoryItem,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: inventoryKeys.lists() });
      const previousInventory = queryClient.getQueryData(inventoryKeys.lists());

      queryClient.setQueryData(
        inventoryKeys.lists(),
        (old: InventoryListResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            inventory: old.inventory.filter((item) => item.id !== id),
          };
        }
      );

      return { previousInventory };
    },
    onError: (err, id, context) => {
      if (context?.previousInventory) {
        queryClient.setQueryData(
          inventoryKeys.lists(),
          context.previousInventory
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });

      // Invalidate recipe queries since deleted inventory affects recipe calculations
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: recipeKeys.details() });
    },
  });
}

export function useInventory() {
  const inventoryQuery = useInventoryQuery();
  const createMutation = useCreateInventory();
  const updateMutation = useUpdateInventory();
  const deleteMutation = useDeleteInventory();

  return {
    inventory: inventoryQuery.data || [],
    loading: inventoryQuery.isLoading,
    error: inventoryQuery.error?.message || null,
    refetch: () => inventoryQuery.refetch(),
    create: createMutation.mutateAsync,
    update: (id: string, data: Partial<InventoryFormData>) =>
      updateMutation.mutateAsync({ id, data }),
    remove: async (id: string) => {
      await deleteMutation.mutateAsync(id);
    },
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
