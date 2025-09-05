import type { Supplier } from "@/utils/types/database";

export interface SuppliersListProps {
  suppliers: Supplier[];
  loading: boolean;
  error: string | null;
  onEdit: (id: string) => void;
  onRetry: () => void;
}
