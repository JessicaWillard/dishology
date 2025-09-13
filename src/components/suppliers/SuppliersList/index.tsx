import { Button } from "../../ui/Button";
import { SupplierCard } from "../SupplierCard";
import type { Supplier } from "@/utils/types/database";
import { Box } from "../../ui/Box";

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
      <Box display="flexCol" gap={4} width="full">
        <p className="text-gray-dark">Loading suppliers...</p>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flexCol" gap={4} width="full">
        <div className="text-error bg-red-50 border border-red-200 rounded p-4">
          <p className="font-semibold">Error loading suppliers:</p>
          <p>{error}</p>
          <Button variant="outline" handlePress={onRetry} className="mt-2">
            Retry
          </Button>
        </div>
      </Box>
    );
  }

  if (suppliers.length === 0) {
    return (
      <Box display="flexCol" gap={4} width="full">
        <p className="text-gray-dark">
          No suppliers found. Create your first supplier above!
        </p>
      </Box>
    );
  }

  // Sort suppliers alphabetically by name
  const sortedSuppliers = [...suppliers].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <Box display="flexCol" gap={4} width="full">
      {sortedSuppliers.map((supplier) => (
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
    </Box>
  );
}
