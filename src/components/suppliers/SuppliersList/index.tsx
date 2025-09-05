import { Button } from "../../ui/Button";
import { SupplierCard } from "../SupplierCard";
import type { Supplier } from "@/utils/types/database";

interface SuppliersListProps {
  suppliers: Supplier[];
  loading: boolean;
  error: string | null;
  onEdit: (id: string) => void;
  onRetry: () => void;
}

export function SuppliersList({
  suppliers,
  loading,
  error,
  onEdit,
  onRetry,
}: SuppliersListProps) {
  if (loading && suppliers.length === 0) {
    return (
      <div className="w-full">
        <p className="text-gray-500">Loading suppliers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="text-red-600 bg-red-50 border border-red-200 rounded p-4">
          <p className="font-semibold">Error loading suppliers:</p>
          <p>{error}</p>
          <Button variant="outline" handlePress={onRetry} className="mt-2">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (suppliers.length === 0) {
    return (
      <div className="w-full">
        <p className="text-gray-500">
          No suppliers found. Create your first supplier above!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
        {suppliers.map((supplier) => (
          <SupplierCard
            key={supplier.id}
            id={supplier.id}
            supplierName={supplier.name}
            description={supplier.description}
            contactName={supplier.contact.contactName}
            email={supplier.contact.email}
            phone={supplier.contact.phone}
            website={supplier.contact.website}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  );
}
