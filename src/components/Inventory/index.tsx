import type { InventoryProps } from "./interface";
import { Box } from "../Box";
import { Text } from "../Text";
import {
  inventoryStyles,
  inventoryCardWrapperStyles,
  inventoryTextStyles,
  inventoryHighlightStyles,
  inventoryCardLowInventoryStyles,
} from "./theme";

export const InventoryCard = (props: InventoryProps) => {
  const {
    id,
    name,
    type = "default",
    description,
    quantity,
    size,
    unit,
    pricePerUnit,
    pricePerPack,
    supplier,
    countDate,
    isLow = false,
    onEdit,
  } = props;

  const handleEdit = () => {
    if (id && onEdit) {
      onEdit(id);
    }
  };

  const totalPrice = pricePerUnit
    ? parseFloat(pricePerUnit) * parseFloat(quantity)
    : 0;

  return (
    <Box
      className={inventoryStyles({ variant: type })}
      padding="md"
      radius="md"
      shadow="md"
    >
      <Box className={inventoryCardWrapperStyles()}>
        <Box width="auto">
          {name && (
            <Text
              size="lg"
              weight="bold"
              className={inventoryTextStyles({ variant: type })}
            >
              {name}
            </Text>
          )}
          {description && (
            <Text size="xs" className="text-gray-dark">
              {description}
            </Text>
          )}
        </Box>
        {isLow && (
          <Box padding="xs" className={inventoryCardLowInventoryStyles()}>
            <Text size="xs">Low stock</Text>
          </Box>
        )}
      </Box>
      <Box className={inventoryCardWrapperStyles()}>
        {supplier && (
          <Text size="sm" weight="bold">
            {supplier}
          </Text>
        )}
        {countDate && (
          <Text size="xs" weight="bold">
            {countDate.toString()}
          </Text>
        )}
      </Box>
      <hr className={inventoryStyles({ variant: type })} />
      <Box display="flexRow" gap="xl" justify="between" align="center">
        <Box display="flexRow" gap="md" justify="start" align="center">
          {size && unit && (
            <Box display="flexCol" gap="xs">
              <Text
                size="xs"
                className={inventoryTextStyles({ variant: type })}
              >
                Size
              </Text>
              <Text size="sm" weight="medium" width="max">
                {parseFloat(size)} {unit}
              </Text>
            </Box>
          )}
          {quantity && (
            <Box
              display="flexCol"
              justify="start"
              align="start"
              radius="sm"
              padding="xs"
              gap="xs"
              className={inventoryHighlightStyles({ variant: type })}
            >
              <Text size="xs">Quantity</Text>
              <Text size="sm" weight="medium">
                {parseFloat(quantity)}
              </Text>
            </Box>
          )}
        </Box>
        <Box display="flexRow" gap="md" justify="end">
          {pricePerUnit && (
            <Box display="flexCol" gap="xs">
              <Text
                size="xs"
                width="max"
                className={inventoryTextStyles({ variant: type })}
              >
                $ / Unit
              </Text>
              <Text size="sm" weight="medium">
                {parseFloat(pricePerUnit).toFixed(2)}
              </Text>
            </Box>
          )}
          {pricePerPack && (
            <Box display="flexCol" gap="xs">
              <Text
                size="xs"
                width="max"
                className={inventoryTextStyles({ variant: type })}
              >
                $ / Pack
              </Text>
              <Text size="sm" weight="medium">
                {parseFloat(pricePerPack).toFixed(2)}
              </Text>
            </Box>
          )}
          <Box display="flexCol" gap="xs">
            <Text
              size="xs"
              width="max"
              className={inventoryTextStyles({ variant: type })}
            >
              Total
            </Text>
            <Text size="sm" weight="medium">
              {`$${totalPrice.toFixed(2)}`}
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

InventoryCard.displayName = "InventoryCard";
