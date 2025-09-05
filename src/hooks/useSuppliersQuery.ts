import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  SupplierFormData,
  SupplierListResponse,
} from "@/utils/types/database";
import {
  fetchSuppliers,
  fetchSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "@/utils/api/suppliers";

// Query keys for consistent caching
export const supplierKeys = {
  all: ["suppliers"] as const,
  lists: () => [...supplierKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...supplierKeys.lists(), { filters }] as const,
  details: () => [...supplierKeys.all, "detail"] as const,
  detail: (id: string) => [...supplierKeys.details(), id] as const,
};

/**
 * Hook for fetching suppliers with React Query
 */
export function useSuppliersQuery() {
  return useQuery({
    queryKey: supplierKeys.lists(),
    queryFn: fetchSuppliers,
    select: (data) => data.suppliers, // Extract suppliers array from response
  });
}

/**
 * Hook for fetching a single supplier
 */
export function useSupplierQuery(id: string) {
  return useQuery({
    queryKey: supplierKeys.detail(id),
    queryFn: () => fetchSupplier(id),
    enabled: !!id, // Only run query if id is provided
  });
}

/**
 * Hook for creating a supplier with optimistic updates
 */
export function useCreateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSupplier,
    onMutate: async (newSupplier) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: supplierKeys.lists() });

      // Snapshot the previous value
      const previousSuppliers = queryClient.getQueryData(supplierKeys.lists());

      // Optimistically update the cache
      queryClient.setQueryData(
        supplierKeys.lists(),
        (old: SupplierListResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            suppliers: [
              {
                id: `temp-${Date.now()}`, // Temporary ID
                user_id: "", // Will be filled by server
                ...newSupplier,
                created_at: new Date().toISOString(),
              },
              ...old.suppliers,
            ],
          };
        }
      );

      return { previousSuppliers };
    },
    onError: (err, newSupplier, context) => {
      // Rollback on error
      if (context?.previousSuppliers) {
        queryClient.setQueryData(
          supplierKeys.lists(),
          context.previousSuppliers
        );
      }
    },
    onSuccess: (newSupplier) => {
      // Update the cache with the real data
      queryClient.setQueryData(
        supplierKeys.lists(),
        (old: SupplierListResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            suppliers: old.suppliers.map((supplier) =>
              supplier.id?.startsWith("temp-") ? newSupplier : supplier
            ),
          };
        }
      );
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
    },
  });
}

/**
 * Hook for updating a supplier with optimistic updates
 */
export function useUpdateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<SupplierFormData>;
    }) => updateSupplier(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: supplierKeys.lists() });

      // Snapshot the previous value
      const previousSuppliers = queryClient.getQueryData(supplierKeys.lists());

      // Optimistically update the cache
      queryClient.setQueryData(
        supplierKeys.lists(),
        (old: SupplierListResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            suppliers: old.suppliers.map((supplier) =>
              supplier.id === id ? { ...supplier, ...data } : supplier
            ),
          };
        }
      );

      return { previousSuppliers };
    },
    onError: (err, _variables, context) => {
      // Rollback on error
      if (context?.previousSuppliers) {
        queryClient.setQueryData(
          supplierKeys.lists(),
          context.previousSuppliers
        );
      }
    },
    onSuccess: (updatedSupplier) => {
      // Update the cache with the real data
      queryClient.setQueryData(
        supplierKeys.lists(),
        (old: SupplierListResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            suppliers: old.suppliers.map((supplier) =>
              supplier.id === updatedSupplier.id ? updatedSupplier : supplier
            ),
          };
        }
      );
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
    },
  });
}

/**
 * Hook for deleting a supplier with optimistic updates
 */
export function useDeleteSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSupplier,
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: supplierKeys.lists() });

      // Snapshot the previous value
      const previousSuppliers = queryClient.getQueryData(supplierKeys.lists());

      // Optimistically update the cache
      queryClient.setQueryData(
        supplierKeys.lists(),
        (old: SupplierListResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            suppliers: old.suppliers.filter((supplier) => supplier.id !== id),
          };
        }
      );

      return { previousSuppliers };
    },
    onError: (err, id, context) => {
      // Rollback on error
      if (context?.previousSuppliers) {
        queryClient.setQueryData(
          supplierKeys.lists(),
          context.previousSuppliers
        );
      }
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
    },
  });
}

/**
 * Combined hook that provides all supplier operations
 * This maintains the same interface as the original useSuppliers hook
 */
export function useSuppliers() {
  const suppliersQuery = useSuppliersQuery();
  const createMutation = useCreateSupplier();
  const updateMutation = useUpdateSupplier();
  const deleteMutation = useDeleteSupplier();

  return {
    suppliers: suppliersQuery.data || [],
    loading: suppliersQuery.isLoading,
    error: suppliersQuery.error?.message || null,
    refetch: () => suppliersQuery.refetch(),
    create: createMutation.mutateAsync,
    update: (id: string, data: Partial<SupplierFormData>) =>
      updateMutation.mutateAsync({ id, data }),
    remove: async (id: string) => {
      await deleteMutation.mutateAsync(id);
    },
    // Additional loading states for individual operations
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
