import type { SupplierCardProps } from "./interface";
import { Box } from "../Box";
import { Button } from "../Button";
import { Text } from "../Text";
import { tv } from "tailwind-variants";
import { clsx } from "clsx";

export const supplierCardContainerStyles = tv({
  base: "flex flex-col gap-4 border-gray-light border",
});

export const supplierCardHeaderStyles = tv({
  base: "flex items-center justify-between gap-8",
});

export const supplierCardBodyStyles = tv({
  base: "grid grid-cols-2 gap-x-8 gap-y-4",
});

export const SupplierCard = (props: SupplierCardProps) => {
  const { supplierName, description, contactName, email, phone, website } =
    props;
  return (
    <Box
      className={clsx(supplierCardContainerStyles())}
      padding="md"
      radius="md"
      shadow="md"
    >
      <Box className={clsx(supplierCardHeaderStyles())}>
        <Box>
          {supplierName && (
            <Text variant="body" size="lg" weight="bold">
              {supplierName}
            </Text>
          )}
          {description && (
            <Text variant="body" size="xs" className="text-gray-dark">
              {description}
            </Text>
          )}
        </Box>
        <Button variant="ghost">Edit</Button>
      </Box>
      <hr className="w-full border-gray-light" />
      <Box className={clsx(supplierCardBodyStyles())}>
        {contactName && (
          <Text variant="body" size="sm" weight="bold">
            {contactName}
          </Text>
        )}
        {phone && (
          <a href={`tel:${phone}`} target="_blank">
            <Text variant="body" size="sm">
              {phone}
            </Text>
          </a>
        )}
        {email && (
          <a href={`mailto:${email}`} target="_blank">
            <Text variant="body" size="sm">
              {email}
            </Text>
          </a>
        )}
        {website && (
          <a href={website || ""} target="_blank">
            <Text variant="body" size="sm">
              {website}
            </Text>
          </a>
        )}
      </Box>
    </Box>
  );
};

SupplierCard.displayName = "SupplierCard";
