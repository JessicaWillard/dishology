"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { Box } from "@/components/ui/Box";
import { InventoryTable } from "@/components/inventory-components/InventoryTable";
import { EditInventorySection } from "@/components/inventory-components/EditInventorySection";
import { useLowStockQuery } from "@/hooks/useLowStockQuery";
import { useInventory } from "@/hooks/useInventoryQuery";
import { useSuppliersQuery } from "@/hooks/useSuppliersQuery";
import { exportToCSV } from "@/utils/csvExport";
import { formatDateForInput } from "@/utils/date";
import type {
  InventoryWithSupplier,
  InventoryFormData,
} from "@/utils/types/database";

export default function Home() {
  const { user, isLoaded } = useUser();
  const { lowStockItems, isLoading, error } = useLowStockQuery();
  const { inventory, update, remove, isUpdating, isDeleting } = useInventory();
  const { data: suppliers = [] } = useSuppliersQuery();
  const [editingItem, setEditingItem] = useState<InventoryWithSupplier | null>(
    null
  );

  // Transform suppliers to match the expected format
  const supplierOptions = suppliers
    .filter((supplier) => supplier.id)
    .map((supplier) => ({
      id: supplier.id!,
      name: supplier.name,
    }));

  const handleEdit = useCallback(
    (id: string) => {
      const item = inventory.find((i) => i.id === id);
      if (item) {
        // Transform the item to have the correct date format for the form
        const editingItem = {
          ...item,
          count_date: formatDateForInput(item.count_date),
        };
        setEditingItem(editingItem);
      }
    },
    [inventory]
  );

  const handleUpdate = useCallback(
    async (id: string, data: Partial<InventoryFormData>) => {
      return await update(id, data);
    },
    [update]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      await remove(id);
    },
    [remove]
  );

  const handleCloseEditPanel = useCallback(() => {
    setEditingItem(null);
  }, []);

  const handleExportLowStock = () => {
    const exportData = lowStockItems.map((item) => ({
      Item: item.name,
      Supplier: item.supplier?.name || "No Supplier",
      "On Hand": parseFloat(item.quantity),
      "To Order": parseFloat(item.minCount || "0") - parseFloat(item.quantity),
    }));

    exportToCSV(exportData, {
      filename: `low-stock-${new Date().toISOString().split("T")[0]}.csv`,
    });
  };

  return (
    <Box display="flexCol" gap={8} className="pt-12">
      <SignedIn>
        <Box display="flexCol" gap="md">
          <Text as="h1" size="lg">
            Hello,
            <span className="font-bold">
              {user && isLoaded
                ? ` ${user.firstName || user.emailAddresses[0]?.emailAddress}!`
                : ""}
            </span>
          </Text>
        </Box>
      </SignedIn>
      <SignedIn>
        <Box display="flexCol" gap="md">
          <Text as="h2" size="md" weight="bold">
            Low stock
          </Text>
          {isLoading ? (
            <Text>Loading low stock items...</Text>
          ) : error ? (
            <Text color="error">Error loading low stock items: {error}</Text>
          ) : lowStockItems.length === 0 ? (
            <Text>No low stock items found.</Text>
          ) : (
            <>
              <InventoryTable
                items={lowStockItems}
                type="mixed"
                onRowClick={handleEdit}
              />
              <Box display="flexRow" justify="end" className="mt-4">
                <Button variant="ghost" handlePress={handleExportLowStock}>
                  Export
                </Button>
              </Box>
            </>
          )}
        </Box>
      </SignedIn>

      {/* <div className="mt-12 text-center"> */}
      <SignedIn>
        <Box display="flexCol" gap="md">
          <Text as="h2" size="md" weight="bold">
            Settings
          </Text>
          <Box>
            <Button variant="solid" href="/suppliers" className="w-full">
              View all suppliers
            </Button>
          </Box>
        </Box>
      </SignedIn>
      <SignedOut>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-800 mb-2">
            Join the Community
          </h3>
          <p className="text-blue-700">
            Create an account to unlock all features and start your cooking
            journey!
          </p>
        </div>
      </SignedOut>
      {/* </div> */}

      {/* Edit Inventory Side Panel */}
      <EditInventorySection
        editingItem={editingItem}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
        suppliers={supplierOptions}
        onClose={handleCloseEditPanel}
      />
    </Box>
  );
}
