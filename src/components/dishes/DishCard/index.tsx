"use client";

import { useState } from "react";
import type { DishCardProps } from "../interface";
import { Box } from "../../ui/Box";
import { Button } from "../../ui/Button";
import { Text } from "../../ui/Text";
import { Icon } from "../../ui/Icon";
import { DishIngredientsTable } from "../DishIngredientsTable";
import { dishCardStyles, metricItemStyles } from "../theme";
import {
  calculateDishCost,
  calculateProfit,
  calculateMargin,
} from "@/utils/dishCalculations";
import { clsx } from "clsx";

export const DishCard = (props: DishCardProps) => {
  const {
    id,
    name,
    description,
    instructions,
    prepTime,
    sellPrice,
    ingredients = [],
    onEdit,
    onIngredientClick,
  } = props;

  // Use controlled or internal state for expanded
  const [isExpanded, setInternalExpanded] = useState(false);

  const handleEdit = () => {
    if (id && onEdit) {
      onEdit(id);
    }
  };

  // Calculate dish metrics
  const totalCost = calculateDishCost(ingredients);
  const profit = calculateProfit(sellPrice || 0, totalCost);
  const margin = calculateMargin(profit, sellPrice || 0);

  // Determine profit variant (positive, negative, or neutral)
  const profitVariant =
    profit > 0 ? "positive" : profit < 0 ? "negative" : "neutral";

  // Parse instructions
  const instructionsList = instructions
    ? instructions.split("\n").map((line, index) => ({
        content: line.trim(),
        isEmpty: line.trim().length === 0,
        key: index,
      }))
    : [];

  return (
    <Box
      className={clsx(dishCardStyles({ expanded: isExpanded }))}
      padding="md"
      radius="md"
    >
      {/* Header */}
      <Box display="flexRow" justify="between" align="start" gap="md">
        <Box width="auto">
          {name && (
            <Text size="lg" weight="bold">
              {name}
            </Text>
          )}
          {description && (
            <Text size="xs" className="text-gray-dark">
              {description}
            </Text>
          )}
        </Box>
        <Button
          variant="outline"
          iconOnly
          handlePress={() => setInternalExpanded(!isExpanded)}
          aria-label={isExpanded ? "Collapse dish" : "Expand dish"}
        >
          <Icon name={isExpanded ? "Minimize" : "Maximize"} />
        </Button>
      </Box>

      <hr className="w-full border-gray-light" />

      {/* Key Metrics Row */}
      <Box display="flexRow" gap="md" justify="between" align="center">
        <Box display="flexRow" gap="md" align="center">
          <Box className={clsx(metricItemStyles())}>
            <Text size="xs" className="text-gray-dark">
              Cost
            </Text>
            <Text size="sm" weight="medium">
              ${totalCost.toFixed(2)}
            </Text>
          </Box>

          <Box className={clsx(metricItemStyles())}>
            <Text size="xs" className="text-gray-dark">
              Sell Price
            </Text>
            <Text size="sm" weight="medium">
              ${(sellPrice || 0).toFixed(2)}
            </Text>
          </Box>
        </Box>
        <Box display="flexRow" gap="md" align="center">
          <Box className={clsx(metricItemStyles())}>
            <Text size="xs" className="text-gray-dark">
              Profit
            </Text>
            <Text size="sm" weight="medium">
              ${profit.toFixed(2)}
            </Text>
          </Box>

          <Box
            className={clsx(
              metricItemStyles({ variant: "highlighted", profitVariant })
            )}
          >
            <Text size="xs">Margin</Text>
            <Text size="sm">{margin.toFixed(2)}%</Text>
          </Box>
        </Box>
      </Box>

      {/* Expanded Content */}
      {isExpanded && (
        <>
          <hr className="w-full border-gray-light" />

          {/* Ingredients Table */}
          <Box>
            <Text size="sm" weight="bold" className="mb-2">
              Ingredients
            </Text>
            <DishIngredientsTable
              ingredients={ingredients}
              showHeader={true}
              onRowClick={onIngredientClick}
            />
          </Box>

          {/* Instructions */}
          {instructions && instructionsList.length > 0 && (
            <>
              <hr className="w-full border-gray-light" />
              <Box>
                <Text size="sm" weight="bold" className="mb-2">
                  Instructions
                </Text>
                <Box display="flexCol" gap="sm" width="auto">
                  {instructionsList.map((line) =>
                    line.isEmpty ? (
                      <Box key={line.key} className="h-2" />
                    ) : (
                      <Text key={line.key} size="sm">
                        • {line.content}
                      </Text>
                    )
                  )}
                </Box>
              </Box>
            </>
          )}

          {/* Prep Time (if available) */}
          {prepTime && (
            <>
              <hr className="w-full border-gray-light" />
              <Box display="flexRow" gap="sm" align="center">
                <Text size="xs" className="text-gray-dark">
                  Prep Time:
                </Text>
                <Text size="sm" weight="medium">
                  {prepTime}
                </Text>
              </Box>
            </>
          )}
        </>
      )}

      {/* Footer with Edit Button */}
      <hr className="w-full border-gray-light" />
      <Box display="flexRow" justify="start">
        <Button variant="ghost" handlePress={handleEdit}>
          Edit
        </Button>
      </Box>
    </Box>
  );
};

DishCard.displayName = "DishCard";
