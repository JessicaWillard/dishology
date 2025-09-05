import { useState, useEffect, useCallback } from "react";
import type { Supplier, SupplierFormData } from "@/utils/types/database";
import {
  fetchSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  SupplierApiError,
} from "@/utils/api/suppliers";

interface UseSuppliersState {
  suppliers: Supplier[];
  loading: boolean;
  error: string | null;
}

interface UseSuppliersReturn extends UseSuppliersState {
  refetch: () => Promise<void>;
  create: (data: SupplierFormData) => Promise<Supplier>;
  update: (id: string, data: Partial<SupplierFormData>) => Promise<Supplier>;
  remove: (id: string) => Promise<void>;
}

/**
 * Hook for managing suppliers data and operations
 */
export function useSuppliers(): UseSuppliersReturn {
  const [state, setState] = useState<UseSuppliersState>({
    suppliers: [],
    loading: true,
    error: null,
  });

  // Fetch suppliers
  const fetchData = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const response = await fetchSuppliers();
      setState({
        suppliers: response.suppliers,
        loading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage =
        error instanceof SupplierApiError
          ? error.message
          : "Failed to fetch suppliers";
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  }, []);

  // Create supplier
  const create = useCallback(
    async (data: SupplierFormData): Promise<Supplier> => {
      try {
        const newSupplier = await createSupplier(data);
        setState((prev) => ({
          ...prev,
          suppliers: [newSupplier, ...prev.suppliers],
          error: null,
        }));
        return newSupplier;
      } catch (error) {
        const errorMessage =
          error instanceof SupplierApiError
            ? error.message
            : "Failed to create supplier";
        setState((prev) => ({ ...prev, error: errorMessage }));
        throw error;
      }
    },
    []
  );

  // Update supplier
  const update = useCallback(
    async (id: string, data: Partial<SupplierFormData>): Promise<Supplier> => {
      try {
        const updatedSupplier = await updateSupplier(id, data);
        setState((prev) => ({
          ...prev,
          suppliers: prev.suppliers.map((supplier) =>
            supplier.id === id ? updatedSupplier : supplier
          ),
          error: null,
        }));
        return updatedSupplier;
      } catch (error) {
        const errorMessage =
          error instanceof SupplierApiError
            ? error.message
            : "Failed to update supplier";
        setState((prev) => ({ ...prev, error: errorMessage }));
        throw error;
      }
    },
    []
  );

  // Delete supplier
  const remove = useCallback(async (id: string): Promise<void> => {
    try {
      await deleteSupplier(id);
      setState((prev) => ({
        ...prev,
        suppliers: prev.suppliers.filter((supplier) => supplier.id !== id),
        error: null,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof SupplierApiError
          ? error.message
          : "Failed to delete supplier";
      setState((prev) => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...state,
    refetch: fetchData,
    create,
    update,
    remove,
  };
}
