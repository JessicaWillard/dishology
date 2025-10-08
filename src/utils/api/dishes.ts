import type {
  DishFormData,
  DishWithIngredients,
  DishIngredientFormData,
} from "@/utils/types/database";

export class DishApiError extends Error {
  constructor(message: string, public status: number, public code?: string) {
    super(message);
    this.name = "DishApiError";
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
    throw new DishApiError(
      errorData.error || "An error occurred",
      response.status,
      errorData.code
    );
  }

  try {
    return await response.json();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new DishApiError("Invalid response from server", response.status);
  }
}

export interface DishListResponse {
  dishes: DishWithIngredients[];
  total: number;
}

export async function fetchDishes(): Promise<DishListResponse> {
  const response = await fetch("/api/dishes", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return handleApiResponse<DishListResponse>(response);
}

export async function fetchDish(id: string): Promise<DishWithIngredients> {
  const response = await fetch(`/api/dishes/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return handleApiResponse<DishWithIngredients>(response);
}

export interface CreateDishData extends DishFormData {
  ingredients?: DishIngredientFormData[];
}

export async function createDish(
  data: CreateDishData
): Promise<DishWithIngredients> {
  const response = await fetch("/api/dishes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleApiResponse<DishWithIngredients>(response);
}

export interface UpdateDishData extends Partial<DishFormData> {
  ingredients?: DishIngredientFormData[];
}

export async function updateDish(
  id: string,
  data: UpdateDishData
): Promise<DishWithIngredients> {
  const response = await fetch(`/api/dishes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleApiResponse<DishWithIngredients>(response);
}

export async function deleteDish(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`/api/dishes/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return handleApiResponse<{ success: boolean }>(response);
}

export const dishesFetcher = () => fetchDishes();
export const dishFetcher = (id: string) => fetchDish(id);
