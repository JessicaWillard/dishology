import type {
  Supplier,
  SupplierFormData,
  SupplierListResponse,
} from "@/types/supplier";

/**
 * Client-side API utilities for supplier operations
 */

export class SupplierApiError extends Error {
  constructor(message: string, public status: number, public code?: string) {
    super(message);
    this.name = "SupplierApiError";
  }
}

async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
    }
    throw new SupplierApiError(
      errorData.error || "An error occurred",
      response.status,
      errorData.code
    );
  }

  try {
    return await response.json();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new SupplierApiError("Invalid response from server", response.status);
  }
}

/**
 * Fetch all suppliers
 */
export async function fetchSuppliers(): Promise<SupplierListResponse> {
  const response = await fetch("/api/suppliers", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return handleApiResponse<SupplierListResponse>(response);
}

/**
 * Fetch a specific supplier by ID
 */
export async function fetchSupplier(id: string): Promise<Supplier> {
  const response = await fetch(`/api/suppliers/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return handleApiResponse<Supplier>(response);
}

/**
 * Create a new supplier
 */
export async function createSupplier(
  data: SupplierFormData
): Promise<Supplier> {
  const response = await fetch("/api/suppliers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleApiResponse<Supplier>(response);
}

/**
 * Update an existing supplier
 */
export async function updateSupplier(
  id: string,
  data: Partial<SupplierFormData>
): Promise<Supplier> {
  const response = await fetch(`/api/suppliers/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleApiResponse<Supplier>(response);
}

/**
 * Delete a supplier
 */
export async function deleteSupplier(
  id: string
): Promise<{ success: boolean }> {
  const response = await fetch(`/api/suppliers/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return handleApiResponse<{ success: boolean }>(response);
}

/**
 * React Query / SWR compatible fetchers
 */
export const suppliersFetcher = () => fetchSuppliers();
export const supplierFetcher = (id: string) => fetchSupplier(id);
