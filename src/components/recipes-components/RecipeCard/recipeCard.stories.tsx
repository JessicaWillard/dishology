import type { Meta, StoryObj } from "@storybook/react-vite";
import { RecipeCard } from "./index";
import type { RecipeCardProps } from "../interface";

const meta: Meta<typeof RecipeCard> = {
  title: "Components/Recipes/RecipeCard",
  component: RecipeCard,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    onEdit: { action: "onEdit" },
    onToggleExpanded: { action: "onToggleExpanded" },
  },
};

export default meta;
type Story = StoryObj<typeof RecipeCard>;

const mockIngredients = [
  {
    id: "1",
    quantity: 3,
    unit: "L",
    inventory: {
      id: "inv-1",
      name: "Olive Oil",
      price_per_unit: "9.00",
      type: "produce",
      unit: "L",
    },
  },
  {
    id: "2",
    quantity: 2,
    unit: "L",
    inventory: {
      id: "inv-2",
      name: "Balsamic Vinegar",
      price_per_unit: "9.00",
      type: "produce",
      unit: "L",
    },
  },
];

export const Collapsed: Story = {
  args: {
    id: "recipe-1",
    name: "Balsamic Vinaigrette",
    description: "Description of the item",
    batchSize: 5,
    batchUnit: "L",
    units: 30,
    prepTime: "30m",
    ingredients: mockIngredients,
    isExpanded: false,
  },
};

export const Expanded: Story = {
  args: {
    id: "recipe-1",
    name: "Balsamic Vinaigrette",
    description: "Description of the item",
    batchSize: 5,
    batchUnit: "L",
    units: 30,
    prepTime: "30m",
    instructions:
      "1. Preheat your oven to 375°F (190°C).\n\n2. In a large bowl, mix together the flour, sugar, and baking powder until well combined.\n\n3. Gradually add in the milk and melted butter, stirring until the batter is smooth.",
    ingredients: mockIngredients,
    isExpanded: true,
  },
};

export const NoDescription: Story = {
  args: {
    id: "recipe-2",
    name: "Simple Recipe",
    batchSize: 1,
    batchUnit: "kg",
    units: 30,
    prepTime: "1h",
    ingredients: [],
    isExpanded: false,
  },
};

export const NoIngredients: Story = {
  args: {
    id: "recipe-3",
    name: "Empty Recipe",
    description: "A recipe with no ingredients yet",
    batchSize: 2.5,
    batchUnit: "lbs",
    units: 30,
    prepTime: "45m",
    ingredients: [],
    isExpanded: true,
  },
};

export const LongInstructions: Story = {
  args: {
    id: "recipe-4",
    name: "Complex Recipe",
    description: "A recipe with detailed instructions",
    batchSize: 3,
    batchUnit: "portions",
    units: 30,
    prepTime: "2h 30m",
    instructions:
      "1. Prepare all ingredients by washing and chopping vegetables into uniform pieces.\n\n2. Heat a large skillet over medium-high heat and add olive oil.\n\n3. Sauté onions until translucent, about 5 minutes.\n4. Add garlic and cook for another minute until fragrant.\n\n5. Add remaining vegetables and cook until tender.\n6. Season with salt, pepper, and herbs to taste.\n\n7. Simmer for 20-30 minutes until flavors meld together.\n8. Serve hot and enjoy!",
    ingredients: [
      {
        id: "1",
        quantity: 1,
        unit: "kg",
        inventory: {
          id: "inv-1",
          name: "Mixed Vegetables",
          price_per_unit: "4.50",
          type: "produce",
          unit: "kg",
        },
      },
      {
        id: "2",
        quantity: 0.5,
        unit: "L",
        inventory: {
          id: "inv-2",
          name: "Vegetable Stock",
          price_per_unit: "3.20",
          type: "beverage",
          unit: "L",
        },
      },
    ],
    isExpanded: true,
  },
};

export const Interactive: Story = {
  args: {
    id: "recipe-5",
    name: "Interactive Recipe",
    description: "Click the expand button to see more details",
    batchSize: 1.5,
    batchUnit: "kg",
    units: 30,
    prepTime: "1h 15m",
    instructions:
      "1. Mix all ingredients together.\n2. Let rest for 30 minutes.\n3. Cook until done.",
    ingredients: mockIngredients,
  },
};
