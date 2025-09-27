import type {
  // Recipe,
  RecipeFormData,
  RecipeListResponse,
  RecipeWithIngredients,
  RecipeIngredientFormData,
} from "@/utils/types/database";

export class RecipeApiError extends Error {
  constructor(message: string, public status: number, public code?: string) {
    super(message);
    this.name = "RecipeApiError";
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
    throw new RecipeApiError(
      errorData.error || "An error occurred",
      response.status,
      errorData.code
    );
  }

  try {
    return await response.json();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new RecipeApiError("Invalid response from server", response.status);
  }
}

export async function fetchRecipes(): Promise<RecipeListResponse> {
  const response = await fetch("/api/recipes", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return handleApiResponse<RecipeListResponse>(response);
}

export async function fetchRecipe(id: string): Promise<RecipeWithIngredients> {
  const response = await fetch(`/api/recipes/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return handleApiResponse<RecipeWithIngredients>(response);
}

export interface CreateRecipeData extends RecipeFormData {
  ingredients?: RecipeIngredientFormData[];
}

export async function createRecipe(
  data: CreateRecipeData
): Promise<RecipeWithIngredients> {
  const response = await fetch("/api/recipes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleApiResponse<RecipeWithIngredients>(response);
}

export interface UpdateRecipeData extends Partial<RecipeFormData> {
  ingredients?: RecipeIngredientFormData[];
}

export async function updateRecipe(
  id: string,
  data: UpdateRecipeData
): Promise<RecipeWithIngredients> {
  const response = await fetch(`/api/recipes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleApiResponse<RecipeWithIngredients>(response);
}

export async function deleteRecipe(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`/api/recipes/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return handleApiResponse<{ success: boolean }>(response);
}

export const recipesFetcher = () => fetchRecipes();
export const recipeFetcher = (id: string) => fetchRecipe(id);
