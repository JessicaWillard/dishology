import type {
  InventoryFormData,
  InventoryListResponse,
  InventoryWithSupplier,
} from "@/utils/types/database";

export class InventoryApiError extends Error {
  constructor(message: string, public status: number, public code?: string) {
    super(message);
    this.name = "InventoryApiError";
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
    throw new InventoryApiError(
      errorData.error || "An error occurred",
      response.status,
      errorData.code
    );
  }

  try {
    return await response.json();
  } catch {
    throw new InventoryApiError(
      "Invalid response from server",
      response.status
    );
  }
}

export async function fetchInventory(): Promise<InventoryListResponse> {
  const response = await fetch("/api/inventory", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return handleApiResponse<InventoryListResponse>(response);
}

export async function fetchInventoryItem(
  id: string
): Promise<InventoryWithSupplier> {
  const response = await fetch(`/api/inventory/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return handleApiResponse<InventoryWithSupplier>(response);
}

export async function createInventoryItem(
  data: InventoryFormData
): Promise<InventoryWithSupplier> {
  const response = await fetch("/api/inventory", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleApiResponse<InventoryWithSupplier>(response);
}

export async function updateInventoryItem(
  id: string,
  data: Partial<InventoryFormData>
): Promise<InventoryWithSupplier> {
  const response = await fetch(`/api/inventory/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleApiResponse<InventoryWithSupplier>(response);
}

export async function deleteInventoryItem(
  id: string
): Promise<{ success: boolean }> {
  const response = await fetch(`/api/inventory/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return handleApiResponse<{ success: boolean }>(response);
}

// Fetcher functions for React Query
export const inventoryFetcher = () => fetchInventory();
export const inventoryItemFetcher = (id: string) => fetchInventoryItem(id);
