import { Box } from "../../ui/Box";
import { Text } from "../../ui/Text";

export const TestCard = () => {
  return (
    <Box padding="md" radius="md" shadow="md">
      <Text>Test Card - Simple Component</Text>
    </Box>
  );
};

TestCard.displayName = "TestCard";
