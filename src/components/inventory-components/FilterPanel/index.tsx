"use client";

import { useState, useEffect } from "react";
import { SidePanel } from "@/components/ui/SidePanel";
import { ComboBox } from "@/components/fields/ComboBox";
import { CheckboxGroup } from "@/components/fields/Checkbox";
import { Switch } from "@/components/fields/Switch";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Text } from "@/components/ui/Text";
import { Box } from "@/components/ui/Box";
import type { FilterPanelProps } from "./interface";
import type { InventoryType } from "@/utils/types/database";

export const FilterPanel = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onResetFilters,
  onApplyFilters,
  availableTypes,
  availableSuppliers,
}: FilterPanelProps) => {
  const [localFilters, setLocalFilters] = useState(filters);

  // Sync local state with external filters prop
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleTypeChange = (selectedTypes: string[]) => {
    const newFilters = {
      ...localFilters,
      types: selectedTypes as InventoryType[],
    };
    setLocalFilters(newFilters);
  };

  const handleSupplierChange = (selectedSuppliers: string[]) => {
    const newFilters = {
      ...localFilters,
      suppliers: selectedSuppliers,
    };
    setLocalFilters(newFilters);
  };

  const handleLowStockChange = (checked: boolean) => {
    const newFilters = {
      ...localFilters,
      lowStock: checked,
    };
    setLocalFilters(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      types: [],
      suppliers: [],
      lowStock: false,
    };
    setLocalFilters(resetFilters);
    onResetFilters();
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    onApplyFilters();
  };

  const typeOptions = [{ id: "all", name: "All types" }, ...availableTypes];

  const supplierOptions = availableSuppliers.map((supplier) => ({
    id: supplier.id,
    name: supplier.name,
    value: supplier.id,
    label: supplier.name,
  }));

  return (
    <SidePanel isOpen={isOpen} onClose={onClose} width="half" position="right">
      <Box display="flexCol" gap="lg" className="h-full">
        {/* Reset Button */}
        <Box>
          <Button
            variant="outline"
            handlePress={handleReset}
            rightIcon="Reset"
            className="w-full"
          >
            Reset Filters
          </Button>
        </Box>

        {/* Type Filter */}
        <Box display="flexCol" gap="sm">
          <ComboBox
            label="Type"
            items={typeOptions}
            selectedKey={
              localFilters.types.length === 0 ? "all" : localFilters.types[0]
            }
            onSelectionChange={(key) => {
              if (key === "all") {
                handleTypeChange([]);
              } else {
                handleTypeChange([key as string]);
              }
            }}
            placeholder="All types"
          />
        </Box>

        {/* Suppliers Filter */}
        <Box display="flexCol" gap="sm">
          <CheckboxGroup
            label="Suppliers"
            items={supplierOptions}
            value={localFilters.suppliers}
            onChange={handleSupplierChange}
            orientation="vertical"
          />
          {availableSuppliers.length > 5 && (
            <Button variant="ghost" className="self-start" rightIcon="Plus">
              View more
            </Button>
          )}
        </Box>

        {/* Low Stock Filter */}
        <Switch
          label="Low stock"
          isSelected={localFilters.lowStock}
          onChange={handleLowStockChange}
        />

        {/* Apply Button */}
        <Box className="mt-auto pt-4">
          <Button variant="solid" handlePress={handleApply} className="w-full">
            Apply Filters
          </Button>
        </Box>
      </Box>
    </SidePanel>
  );
};

FilterPanel.displayName = "FilterPanel";
