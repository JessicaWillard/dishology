"use client";

import { useState, useMemo, useCallback } from "react";
import { useInventory } from "@/hooks/useInventoryQuery";
import { useSuppliersQuery } from "@/hooks/useSuppliersQuery";
// TESTING: Adding back components one by one
import { InventoryCard } from "@/components/inventory/InventoryCard";
// import { InventoryTable } from "@/components/inventory/InventoryTable";
// import { CreateInventorySection } from "@/components/inventory/CreateInventorySection";
// import { EditInventorySection } from "@/components/inventory/EditInventorySection";
// import { ComboBox } from "@/components/fields/ComboBox";
import { Input } from "@/components/fields/Input";
import { Button } from "@/components/ui/Button";
import { Box } from "@/components/ui/Box";
import { Text } from "@/components/ui/Text";
import { Icon } from "@/components/ui/Icon";
import type {
  InventoryWithSupplier,
  InventoryType,
  InventoryFormData,
} from "@/utils/types/database";
import { formatDateForInput } from "@/utils/date";
import { tv } from "tailwind-variants";

const inventoryPageStyles = tv({
  base: "flex flex-col gap-6",
});

// const controlsBarStyles = tv({
//   base: "flex items-center justify-between gap-4",
// });

const viewToggleStyles = tv({
  base: "flex items-center gap-2",
});

// const searchSectionStyles = tv({
//   base: "flex items-center gap-4",
// });

const contentStyles = tv({
  base: "flex flex-col gap-6",
});

const clusterStyles = tv({
  base: "flex flex-col gap-4",
});

// const clusterHeaderStyles = tv({
//   base: "flex items-center justify-between p-3 rounded-lg text-white font-medium",
//   variants: {
//     type: {
//       produce: "bg-green-600",
//       dry: "bg-amber-600",
//       meat: "bg-red-600",
//       dairy: "bg-blue-600",
//       beverage: "bg-purple-600",
//       cleaning: "bg-gray-600",
//       smallwares: "bg-orange-600",
//       equipment: "bg-indigo-600",
//       other: "bg-slate-600",
//     },
//   },
// });

const clusterContentStyles = tv({
  base: "grid gap-4",
  variants: {
    view: {
      card: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      table: "grid-cols-1",
    },
  },
});

type ViewMode = "card" | "table";

const INVENTORY_TYPE_LABELS: Record<InventoryType, string> = {
  produce: "Produce",
  dry: "Dry Goods",
  meat: "Meat",
  beverage: "Beverage",
  dairy: "Dairy",
  cleaning: "Cleaning",
  smallwares: "Smallwares",
  equipment: "Equipment",
  other: "Other",
};

interface InventoryClientProps {
  userId: string;
}

export function InventoryClient({ userId }: InventoryClientProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [showCreatePanel, setShowCreatePanel] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryWithSupplier | null>(
    null
  );

  const {
    inventory,
    loading,
    error,
    refetch,
    create,
    update,
    remove,
    isCreating,
    isUpdating,
    isDeleting,
  } = useInventory();

  const { data: suppliers = [] } = useSuppliersQuery();

  // Filter and group inventory by type
  const filteredAndGroupedInventory = useMemo(() => {
    let filtered = inventory;

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item as InventoryWithSupplier).supplier?.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (selectedType) {
      filtered = filtered.filter((item) => item.type === selectedType);
    }

    // Group by type
    const grouped = filtered.reduce((acc, item) => {
      const type = item.type || "other";
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(item);
      return acc;
    }, {} as Record<string, InventoryWithSupplier[]>);

    // Sort types by predefined order
    const typeOrder: InventoryType[] = [
      "produce",
      "dry",
      "meat",
      "dairy",
      "beverage",
      "cleaning",
      "smallwares",
      "equipment",
      "other",
    ];

    return typeOrder
      .filter((type) => grouped[type]?.length > 0)
      .map((type) => ({
        type,
        items: grouped[type],
      }));
  }, [inventory, searchTerm, selectedType]);

  const handleViewToggle = useCallback(() => {
    setViewMode((prev) => (prev === "card" ? "table" : "card"));
  }, []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  const handleTypeChange = useCallback((key: string) => {
    setSelectedType(key || "");
  }, []);

  const handleCreate = useCallback(
    async (data: InventoryFormData) => {
      return await create(data);
    },
    [create]
  );

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

  const handleCloseCreatePanel = useCallback(() => {
    setShowCreatePanel(false);
  }, []);

  const handleCloseEditPanel = useCallback(() => {
    setEditingItem(null);
  }, []);

  const handleOpenCreatePanel = useCallback(() => {
    setShowCreatePanel(true);
  }, []);

  // Prepare suppliers for ComboBox
  const supplierOptions = suppliers.map((supplier) => ({
    id: supplier.id!,
    name: supplier.name,
  }));

  const typeOptions = Object.entries(INVENTORY_TYPE_LABELS).map(
    ([value, label]) => ({
      id: value,
      name: label,
    })
  );

  if (loading) {
    return (
      <Box className="flex items-center justify-center p-8">
        <Text>Loading inventory...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="flex flex-col items-center justify-center p-8 gap-4">
        <Text className="text-red-600">Error loading inventory: {error}</Text>
        <Button handlePress={() => refetch()}>Try Again</Button>
      </Box>
    );
  }

  return (
    <Box className={inventoryPageStyles()}>
      {/* Controls Bar */}
      <Box
        // className={controlsBarStyles()}
        display="flexRow"
        justify="between"
        align="center"
        gap="md"
      >
        <Box className={viewToggleStyles()}>
          <Button
            variant="ghost"
            handlePress={handleViewToggle}
            iconOnly
            aria-label={`Switch to ${
              viewMode === "card" ? "table" : "card"
            } view`}
          >
            <Icon name={viewMode === "card" ? "List" : "Grid"} />
          </Button>
        </Box>

        <Button variant="solid" handlePress={handleOpenCreatePanel} iconOnly>
          <Icon name="Plus" />
        </Button>
        <Button variant="ghost" iconOnly>
          <Icon name="Filter" />
        </Button>
      </Box>
      <Box
      // className={searchSectionStyles()}
      // display="flexRow"
      // align="center"
      // gap="sm"
      >
        {/* <ComboBox
          items={typeOptions}
          selectedKey={selectedType}
          onSelectionChange={(key) => handleTypeChange(key as string)}
          placeholder="Filter by type"
          className="w-40"
        /> */}
        <Input
          placeholder="Search inventory..."
          value={searchTerm}
          onChange={(value, e) => handleSearchChange(e)}
          rightIcon="Search"
        />
      </Box>

      {/* Content */}
      <Box className={contentStyles()}>
        {filteredAndGroupedInventory.length === 0 ? (
          <Box className="flex flex-col items-center justify-center p-8 gap-4">
            <Icon name="Dish" className="text-gray-400" />
            <Text className="text-gray-600">
              {searchTerm || selectedType
                ? "No inventory items match your search criteria."
                : "No inventory items found. Add your first item to get started."}
            </Text>
            {!searchTerm && !selectedType && (
              <Button variant="solid" handlePress={handleOpenCreatePanel}>
                Add First Item
              </Button>
            )}
          </Box>
        ) : (
          filteredAndGroupedInventory.map(({ type, items }) => (
            <Box key={type} className={clusterStyles()}>
              {/* <Box className={clusterHeaderStyles({ type })}>
                <Text variant="body" size="lg" weight="bold">
                  {INVENTORY_TYPE_LABELS[type as InventoryType]} ({items.length}
                  )
                </Text>
              </Box> */}
              <Box className={clusterContentStyles({ view: viewMode })}>
                {/* TESTING: Adding back InventoryCard only */}
                {viewMode === "card" ? (
                  items.map((item) => (
                    <InventoryCard
                      key={item.id}
                      id={item.id!}
                      name={item.name}
                      type={item.type || "other"}
                      description={item.description}
                      quantity={item.quantity}
                      size={item.size}
                      unit={item.unit}
                      pricePerUnit={item.price_per_unit}
                      pricePerPack={item.price_per_pack}
                      supplier={item.supplier?.name}
                      countDate={item.count_date}
                      minCount={item.min_count}
                      onEdit={handleEdit}
                    />
                  ))
                ) : (
                  <Text>Table view temporarily disabled for testing</Text>
                )}
                {/* <InventoryTable
                    items={items.map((item) => ({
                      id: item.id!,
                      name: item.name,
                      type: item.type || "other",
                      description: item.description,
                      quantity: item.quantity,
                      size: item.size,
                      unit: item.unit,
                      pricePerUnit: item.price_per_unit,
                      pricePerPack: item.price_per_pack,
                      supplier: (item as InventoryWithSupplier).supplier?.name,
                      countDate: item.count_date,
                      minCount: item.min_count,
                    }))}
                    type={type as InventoryType}
                    onRowClick={handleEdit}
                  /> */}
              </Box>
            </Box>
          ))
        )}
      </Box>

      {/* Side Panels - TEMPORARILY COMMENTED OUT FOR DEPLOYMENT TESTING */}
      {/* <CreateInventorySection
        onCreate={handleCreate}
        isCreating={isCreating}
        suppliers={supplierOptions}
        isVisible={showCreatePanel}
        onClose={handleCloseCreatePanel}
      />

      <EditInventorySection
        editingItem={editingItem}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
        suppliers={supplierOptions}
        onClose={handleCloseEditPanel}
      /> */}
    </Box>
  );
}

InventoryClient.displayName = "InventoryClient";
