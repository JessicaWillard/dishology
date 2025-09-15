import { useInventoryQuery } from "./useInventoryQuery";
import type {
  InventoryProps,
  InventoryType,
} from "@/components/inventory-components/interface";

export function useLowStockQuery() {
  const { data: inventory, isLoading, error } = useInventoryQuery();

  const lowStockItems: InventoryProps[] = inventory
    ? inventory
        .filter((item) => {
          const quantity = parseFloat(item.quantity);
          const minCount = parseFloat(item.min_count || "0");
          return quantity <= minCount;
        })
        .map((item) => ({
          id: item.id,
          name: item.name,
          type: item.type || "other",
          description: item.description,
          quantity: item.quantity,
          size: item.size,
          unit: item.unit,
          pricePerUnit: item.price_per_unit,
          pricePerPack: item.price_per_pack,
          supplier: item.supplier_id,
          location: item.location,
          minCount: item.min_count,
          countDate: item.count_date,
        }))
        .sort((a, b) => {
          // Use the same type order as the inventory client
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

          const typeA = a.type || "other";
          const typeB = b.type || "other";

          const indexA = typeOrder.indexOf(typeA);
          const indexB = typeOrder.indexOf(typeB);

          if (indexA !== indexB) {
            return indexA - indexB;
          }
          // Then sort by name alphabetically within each type
          return a.name.localeCompare(b.name);
        })
    : [];

  return {
    lowStockItems,
    isLoading,
    error: error?.message || null,
  };
}
