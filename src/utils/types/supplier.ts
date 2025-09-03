/**
 * Supplier types based on the actual database schema
 */

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

// API response types
export interface SupplierListResponse {
  suppliers: Supplier[];
  total: number;
}

// Profile type (from your database)
export interface Profile {
  id: string;
  email?: string;
  restaurant_id?: string;
  created_at?: string;
}

// Restaurant type (from your database)
export interface Restaurant {
  id: string;
  name: string;
  created_at?: string;
}
