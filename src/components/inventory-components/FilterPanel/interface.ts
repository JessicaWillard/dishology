import type { InventoryType } from "@/utils/types/database";

export interface FilterOptions {
  types: InventoryType[];
  suppliers: string[];
  lowStock: boolean;
}

export interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onResetFilters: () => void;
  onApplyFilters: () => void;
  availableTypes: Array<{ id: string; name: string }>;
  availableSuppliers: Array<{ id: string; name: string }>;
}
