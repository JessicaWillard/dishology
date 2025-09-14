"use client";

import { useState, useMemo, useCallback } from "react";
import { useInventory } from "@/hooks/useInventoryQuery";
import { useSuppliersQuery } from "@/hooks/useSuppliersQuery";
import { useControlsBarHeight } from "@/hooks/useControlsBarHeight";
import { InventoryCard } from "@/components/inventory-components/InventoryCard";
import { InventoryTable } from "@/components/inventory-components/InventoryTable";
import { CreateInventorySection } from "@/components/inventory-components/CreateInventorySection";
import { EditInventorySection } from "@/components/inventory-components/EditInventorySection";
import { FilterPanel } from "@/components/inventory-components/FilterPanel";
import { Button } from "@/components/ui/Button";
import { Box } from "@/components/ui/Box";
import { Text } from "@/components/ui/Text";
import { Icon } from "@/components/ui/Icon";
import { ControlsBar } from "@/components/ui/ControlsBar";
import type {
  InventoryWithSupplier,
  InventoryType,
  InventoryFormData,
} from "@/utils/types/database";
import type { FilterOptions } from "@/components/inventory-components/FilterPanel/interface";
import { formatDateForInput } from "@/utils/date";
import {
  exportToCSV,
  formatDateForCSV,
  formatCurrencyForCSV,
} from "@/utils/csvExport";
import { tv } from "tailwind-variants";

const clusterContentStyles = tv({
  base: "grid gap-4",
  variants: {
    view: {
      card: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
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

export function InventoryClient({}: InventoryClientProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreatePanel, setShowCreatePanel] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryWithSupplier | null>(
    null
  );
  const [filters, setFilters] = useState<FilterOptions>({
    types: [],
    suppliers: [],
    lowStock: false,
  });

  // Get dynamic height for ControlsBar
  const {
    height: controlsBarHeight,
    controlsBarRef,
    forceUpdateHeight,
  } = useControlsBarHeight();

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

    // Filter by selected types
    if (filters.types.length > 0) {
      filtered = filtered.filter(
        (item) => item.type && filters.types.includes(item.type)
      );
    }

    // Filter by suppliers
    if (filters.suppliers.length > 0) {
      filtered = filtered.filter(
        (item) =>
          (item as InventoryWithSupplier).supplier?.id &&
          filters.suppliers.includes(
            (item as InventoryWithSupplier).supplier!.id
          )
      );
    }

    // Filter by low stock
    if (filters.lowStock) {
      filtered = filtered.filter((item) => {
        const quantity = parseFloat(item.quantity);
        const minCount = item.min_count ? parseFloat(item.min_count) : 0;
        return quantity <= minCount;
      });
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
        items: grouped[type].sort((a, b) => a.name.localeCompare(b.name)),
      }));
  }, [inventory, searchTerm, filters]);

  const handleViewToggle = useCallback(() => {
    setViewMode((prev) => (prev === "card" ? "table" : "card"));
  }, []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      // Force height update when search changes (in case it affects layout)
      setTimeout(forceUpdateHeight, 100);
    },
    [forceUpdateHeight]
  );

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

  const handleOpenFilterPanel = useCallback(() => {
    setShowFilterPanel(true);
  }, []);

  const handleCloseFilterPanel = useCallback(() => {
    setShowFilterPanel(false);
  }, []);

  const handleFiltersChange = useCallback(
    (newFilters: FilterOptions) => {
      setFilters(newFilters);
      // Force height update when filters change
      setTimeout(forceUpdateHeight, 100);
    },
    [forceUpdateHeight]
  );

  const handleResetFilters = useCallback(() => {
    setFilters({
      types: [],
      suppliers: [],
      lowStock: false,
    });
    // Force height update when filters are reset
    setTimeout(forceUpdateHeight, 100);
  }, [forceUpdateHeight]);

  const handleApplyFilters = useCallback(() => {
    setShowFilterPanel(false);
  }, []);

  const handleExportToCSV = useCallback(() => {
    // Get all filtered items (flattened from grouped structure)
    const allFilteredItems = filteredAndGroupedInventory.flatMap(
      (group) => group.items
    );

    if (allFilteredItems.length === 0) {
      return;
    }

    // Transform data for CSV export
    const csvData = allFilteredItems.map((item) => ({
      Name: item.name,
      Type: INVENTORY_TYPE_LABELS[item.type as InventoryType] || "Other",
      Description: item.description || "",
      Quantity: item.quantity,
      Size: item.size || "",
      Unit: item.unit || "",
      "Price per Unit": formatCurrencyForCSV(item.price_per_unit),
      "Price per Pack": item.price_per_pack
        ? formatCurrencyForCSV(item.price_per_pack)
        : "",
      Supplier: (item as InventoryWithSupplier).supplier?.name || "",
      Location: item.location || "",
      "Min Count": item.min_count || "",
      "Count Date": formatDateForCSV(item.count_date),
      "Created At": item.created_at ? formatDateForCSV(item.created_at) : "",
    }));

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `inventory-export-${timestamp}.csv`;

    exportToCSV(csvData, { filename });
  }, [filteredAndGroupedInventory]);

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
      <Box display="flexCol" align="start" justify="start" padding="lg" gap={4}>
        <Text>Loading inventory...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flexCol" align="start" justify="start" padding="lg" gap={4}>
        <Text className="text-error">Error loading inventory: {error}</Text>
        <Button handlePress={() => refetch()}>Try Again</Button>
      </Box>
    );
  }

  // Generate filter tags JSX
  const renderFilterTags = () => {
    if (
      filters.types.length === 0 &&
      filters.suppliers.length === 0 &&
      !filters.lowStock
    ) {
      return null;
    }

    return (
      <Box display="flexRow" gap={2} className="flex-wrap">
        {filters.types.map((type) => (
          <Button
            key={`type-${type}`}
            variant="tag"
            handlePress={() => {
              const newFilters = {
                ...filters,
                types: filters.types.filter((t) => t !== type),
              };
              setFilters(newFilters);
              // Force height update when filter is removed
              setTimeout(forceUpdateHeight, 100);
            }}
            rightIcon="CloseBtn"
          >
            {INVENTORY_TYPE_LABELS[type as InventoryType]}
          </Button>
        ))}
        {filters.suppliers.map((supplierId) => {
          const supplier = suppliers.find((s) => s.id === supplierId);
          return (
            <Button
              key={`supplier-${supplierId}`}
              variant="tag"
              handlePress={() => {
                const newFilters = {
                  ...filters,
                  suppliers: filters.suppliers.filter((s) => s !== supplierId),
                };
                setFilters(newFilters);
                // Force height update when filter is removed
                setTimeout(forceUpdateHeight, 100);
              }}
              rightIcon="CloseBtn"
            >
              {supplier?.name || "Unknown Supplier"}
            </Button>
          );
        })}
        {filters.lowStock && (
          <Button
            variant="tag"
            handlePress={() => {
              const newFilters = {
                ...filters,
                lowStock: false,
              };
              setFilters(newFilters);
              // Force height update when filter is removed
              setTimeout(forceUpdateHeight, 100);
            }}
            rightIcon="CloseBtn"
          >
            Low Stock
          </Button>
        )}
      </Box>
    );
  };

  return (
    <Box display="flexCol" gap={6}>
      {/* Controls Bar */}
      <ControlsBar
        ref={controlsBarRef}
        search={{
          placeholder: "Search inventory...",
          value: searchTerm,
          onChange: handleSearchChange,
        }}
        viewToggle={{
          currentView: viewMode,
          onToggle: handleViewToggle,
        }}
        primaryAction={{
          onPress: handleOpenCreatePanel,
          icon: "Plus",
          label: "Add inventory item",
        }}
        secondaryActions={[
          {
            onPress: handleOpenFilterPanel,
            icon: "Filter",
            label: "Filter inventory",
            variant: "ghost",
          },
        ]}
        filterTags={renderFilterTags()}
      />

      {/* Content */}
      <Box
        display="flexCol"
        gap={6}
        style={{
          marginTop: `${controlsBarHeight + 16}px`, // Use the measured height + 16px spacing
        }}
      >
        {filteredAndGroupedInventory.length === 0 ? (
          <Box
            display="flexCol"
            align="center"
            justify="center"
            padding="lg"
            gap={4}
          >
            <Icon name="Dish" className="text-gray-400" />
            <Text className="text-gray-600">
              {searchTerm ||
              filters.types.length > 0 ||
              filters.suppliers.length > 0 ||
              filters.lowStock
                ? "No inventory items match your search criteria."
                : "No inventory items found. Add your first item to get started."}
            </Text>
            {!searchTerm &&
              filters.types.length === 0 &&
              filters.suppliers.length === 0 &&
              !filters.lowStock && (
                <Button variant="solid" handlePress={handleOpenCreatePanel}>
                  Add First Item
                </Button>
              )}
          </Box>
        ) : (
          filteredAndGroupedInventory.map(({ type, items }) => (
            <Box key={type} display="flexCol" gap={6}>
              <Box className={clusterContentStyles({ view: viewMode })}>
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
                  <InventoryTable
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
                  />
                )}
              </Box>
            </Box>
          ))
        )}
        <Box display="flexRow" justify="center" width="full">
          <Button
            variant="solid"
            handlePress={handleExportToCSV}
            aria-label="Export to CSV"
            rightIcon="Download"
          >
            Export to CSV
          </Button>
        </Box>
      </Box>

      {/* Side Panels */}
      <CreateInventorySection
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
      />

      <FilterPanel
        isOpen={showFilterPanel}
        onClose={handleCloseFilterPanel}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onResetFilters={handleResetFilters}
        onApplyFilters={handleApplyFilters}
        availableTypes={typeOptions}
        availableSuppliers={supplierOptions}
      />
    </Box>
  );
}

InventoryClient.displayName = "InventoryClient";
