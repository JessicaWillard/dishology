import { useState } from "react";
import type { RecipeCardProps } from "../interface";
import { Box } from "../../ui/Box";
import { Button } from "../../ui/Button";
import { Text } from "../../ui/Text";
import { Icon } from "../../ui/Icon";
import { RecipeIngredientsTable } from "../RecipeIngredientsTable";
import {
  recipeCardStyles,
  recipeCardHeaderStyles,
  recipeCardMetricStyles,
  recipeCardTotalStyles,
} from "../theme";
import {
  calculateRecipeCost,
  calculateCostPerUnit,
} from "@/utils/recipeCalculations";
import { clsx } from "clsx";

export const RecipeCard = (props: RecipeCardProps) => {
  const {
    id,
    name,
    description,
    batchSize,
    batchUnit,
    units,
    prepTime,
    instructions,
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

  // Calculate recipe metrics
  const totalCost = calculateRecipeCost(ingredients);
  const costPerUnit = calculateCostPerUnit(totalCost, units || 0);

  // Parse instructions - preserve empty lines as breaks, filter only completely empty content
  const instructionsList = instructions
    ? instructions.split("\n").map((line, index) => ({
        content: line.trim(),
        isEmpty: line.trim().length === 0,
        key: index,
      }))
    : [];

  return (
    <Box className={clsx(recipeCardStyles())} padding="md" radius="md">
      {/* Header */}
      <Box className={clsx(recipeCardHeaderStyles())}>
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
          aria-label={isExpanded ? "Collapse recipe" : "Expand recipe"}
        >
          <Icon name={isExpanded ? "Minimize" : "Maximize"} />
        </Button>
      </Box>

      <hr className="w-full border-gray-light" />

      {/* Key Metrics */}
      <Box display="flexRow" gap="md" justify="between" align="center">
        <Box display="flexRow" gap={6} align="center">
          {batchSize && batchUnit && (
            <Box className={clsx(recipeCardMetricStyles())}>
              <Text size="xs" className="text-gray-dark">
                Batch size
              </Text>
              <Text size="sm" weight="medium">
                {batchSize} {batchUnit}
              </Text>
            </Box>
          )}

          {units && units > 0 && (
            <Box className={clsx(recipeCardMetricStyles())}>
              <Text size="xs" className="text-gray-dark">
                Units
              </Text>
              <Text size="sm" weight="medium">
                {Math.round(units * 100) / 100}
              </Text>
            </Box>
          )}

          {prepTime && (
            <Box className={clsx(recipeCardMetricStyles())}>
              <Text size="xs" className="text-gray-dark">
                Prep time
              </Text>
              <Text size="sm" weight="medium">
                {prepTime}
              </Text>
            </Box>
          )}
        </Box>

        <Box display="flexRow" gap={6} align="center">
          {costPerUnit > 0 && (
            <Box className={clsx(recipeCardMetricStyles())}>
              <Text size="xs" className="text-gray-dark">
                $ / unit
              </Text>
              <Text size="sm" weight="medium">
                ${costPerUnit.toFixed(2)}
              </Text>
            </Box>
          )}

          <Box className={clsx(recipeCardTotalStyles())}>
            <Text size="xs">Total</Text>
            <Text size="sm" weight="medium">
              ${totalCost.toFixed(2)}
            </Text>
          </Box>
        </Box>
      </Box>

      {/* Expanded Content */}
      {isExpanded && (
        <>
          <hr className="w-full border-gray-light" />
          <Box display="flexCol" gap={6}>
            {/* Ingredients Table */}
            {ingredients.length > 0 && (
              <Box display="flexCol" gap={4}>
                <Text size="md" weight="bold">
                  Ingredients
                </Text>
                <RecipeIngredientsTable
                  ingredients={ingredients}
                  onRowClick={onIngredientClick}
                />
              </Box>
            )}

            <hr className="w-full border-gray-light" />
            {/* Instructions */}
            {instructions && instructionsList.length > 0 && (
              <Box display="flexCol" gap={4}>
                <Text size="md" weight="bold">
                  Instructions
                </Text>
                <div>
                  {instructionsList.map((item) => {
                    if (item.isEmpty) {
                      // Render empty lines as line breaks
                      return <br key={item.key} />;
                    }

                    // Check if the line starts with a number (for numbered lists)
                    const isNumberedLine = /^\d+\.?\s/.test(item.content);

                    if (isNumberedLine) {
                      // Render as list item if it starts with a number
                      return (
                        <div key={item.key} className="mb-1">
                          <Text size="sm">{item.content}</Text>
                        </div>
                      );
                    } else {
                      // Render as regular paragraph
                      return (
                        <div key={item.key} className="mb-1">
                          <Text size="sm">{item.content}</Text>
                        </div>
                      );
                    }
                  })}
                </div>
              </Box>
            )}
          </Box>
        </>
      )}

      {/* Edit Button */}
      {onEdit && (
        <Box display="flexRow" justify="start" className="mt-4">
          <Button variant="ghost" handlePress={handleEdit}>
            Edit
          </Button>
        </Box>
      )}
    </Box>
  );
};

RecipeCard.displayName = "RecipeCard";
