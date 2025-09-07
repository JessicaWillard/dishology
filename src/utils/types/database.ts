/**
 * Database types for the modified schema
 * All tables now use user_id (text) for Clerk ID association
 */

import type { Nullable } from "./components";

// Supplier types
export interface Supplier {
  id?: string; // uuid primary key
  user_id: string; // text field for Clerk user ID
  name: string; // supplier name (required)
  description?: string; // supplier description
  contact: SupplierContact; // contact information as JSONB
  created_at?: string; // timestamptz
}

export interface SupplierContact {
  contactName?: string; // contact person name
  phone?: string; // contact phone number
  email?: string; // contact email address
  website?: string; // supplier website
}

// Form data type for create/edit operations
export interface SupplierFormData {
  name: string;
  description: string;
  contact: SupplierContact;
}

// API request types
export interface CreateSupplierRequest extends SupplierFormData {
  user_id: string;
}

export interface UpdateSupplierRequest extends Partial<SupplierFormData> {
  id: string;
}

export interface CreateInventoryRequest extends InventoryFormData {
  user_id: string;
}

export interface UpdateInventoryRequest extends Partial<InventoryFormData> {
  id: string;
}

// API response types
export interface SupplierListResponse {
  suppliers: Supplier[];
  total: number;
}

// Base types
export type InventoryType =
  | "produce"
  | "dry"
  | "meat"
  | "dairy"
  | "beverage"
  | "cleaning"
  | "smallwares"
  | "equipment"
  | "other";

// Inventory table
export interface Inventory {
  id: string; // uuid
  user_id: string; // Clerk ID (text)
  name: string;
  type: Nullable<InventoryType> | null;
  description?: Nullable<string>;
  quantity: string; // as per InventoryProps interface
  size?: Nullable<string>;
  unit?: Nullable<string>;
  price_per_unit: string; // as per InventoryProps interface
  price_per_pack?: Nullable<string>;
  supplier_id?: Nullable<string>; // uuid reference to suppliers_simple
  location?: Nullable<string>;
  min_count?: Nullable<string>;
  count_date: string; // timestamptz
  created_at?: string; // timestamptz
}

// Recipe table
export interface Recipe {
  id: string; // uuid
  user_id: string; // Clerk ID (text)
  name: string;
  description?: Nullable<string>;
  batch_size?: Nullable<number>;
  batch_unit?: Nullable<string>;
  prep_time?: Nullable<string>; // e.g., "30m"
  instructions?: Nullable<string>;
  created_at?: string; // timestamptz
}

// Recipe ingredients junction table
export interface RecipeIngredient {
  id: string; // uuid
  recipe_id: string; // uuid reference to recipes
  inventory_id: string; // uuid reference to inventory
  quantity: number;
  unit?: Nullable<string>;
  created_at?: string; // timestamptz
}

// Dish table
export interface Dish {
  id: string; // uuid
  user_id: string; // Clerk ID (text)
  name: string;
  description?: Nullable<string>;
  instructions?: Nullable<string>;
  prep_time?: Nullable<string>; // e.g., "5m"
  sell_price?: Nullable<number>;
  created_at?: string; // timestamptz
}

// Dish ingredients junction table (can reference both inventory and recipes)
export interface DishIngredient {
  id: string; // uuid
  dish_id: string; // uuid reference to dishes
  inventory_id?: Nullable<string>; // uuid reference to inventory (for direct ingredients)
  recipe_id?: Nullable<string>; // uuid reference to recipes (for recipe components)
  quantity: number;
  unit?: Nullable<string>;
  created_at?: string; // timestamptz
}

// Updated inventory records table
export interface InventoryRecord {
  id: string; // uuid
  user_id: string; // Clerk ID (text) - updated from restaurant_id
  item_id: string; // uuid reference to inventory
  qty: number;
  unit: string;
  recorded_by: string; // uuid reference to users.id (internal UUID)
  note?: Nullable<string>;
  recorded_at: string; // timestamptz
}

// Updated stock movements table
export interface StockMovement {
  id: string; // uuid
  user_id: string; // Clerk ID (text) - updated from restaurant_id
  item_id: string; // uuid reference to inventory
  type: Nullable<string>;
  qty: number;
  unit: string;
  note?: Nullable<string>;
  created_at?: string; // timestamptz
}

// Form data types for creating/updating records
export interface InventoryFormData {
  name: string;
  type: Nullable<InventoryType> | null;
  description?: string;
  quantity: string;
  size?: string;
  unit?: string;
  price_per_unit: string;
  price_per_pack?: string;
  supplier_id?: string;
  location?: string;
  min_count?: string;
  count_date: string;
}

export interface RecipeFormData {
  name: string;
  description?: string;
  batch_size?: number;
  batch_unit?: string;
  prep_time?: string;
  instructions?: string;
}

export interface DishFormData {
  name: string;
  description?: string;
  instructions?: string;
  prep_time?: string;
  sell_price?: number;
}

export interface RecipeIngredientFormData {
  inventory_id: string;
  quantity: number;
  unit?: string;
}

export interface DishIngredientFormData {
  inventory_id?: string;
  recipe_id?: string;
  quantity: number;
  unit?: string;
}

// API response types
export interface InventoryListResponse {
  inventory: Inventory[];
  total: number;
}

export interface RecipeListResponse {
  recipes: Recipe[];
  total: number;
}

export interface DishListResponse {
  dishes: Dish[];
  total: number;
}

// Extended types with related data
export interface InventoryWithSupplier extends Inventory {
  supplier?: {
    id: string;
    name: string;
    contact: SupplierContact; // JSONB contact data
  };
}

export interface RecipeWithIngredients extends Recipe {
  ingredients: (RecipeIngredient & {
    inventory: Inventory;
  })[];
}

export interface DishWithIngredients extends Dish {
  ingredients: (DishIngredient & {
    inventory?: Inventory;
    recipe?: Recipe;
  })[];
}
