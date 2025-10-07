import type { Meta, StoryObj } from "@storybook/react-vite";
import { DishCard } from "./index";
import type { DishCardProps } from "../interface";

const meta: Meta<typeof DishCard> = {
  title: "Dishes/DishCard",
  component: DishCard,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DishCard>;

const sampleIngredients: DishCardProps["ingredients"] = [
  {
    id: "1",
    quantity: 2,
    unit: "cups",
    inventory_id: "inv-1",
    recipe_id: null,
    inventory: {
      id: "inv-1",
      name: "Fresh Tomatoes",
      price_per_unit: "5.00",
      size: "10",
      type: "produce",
      unit: "cups",
    },
    recipe: null,
  },
  {
    id: "2",
    quantity: 1,
    unit: "unit",
    inventory_id: null,
    recipe_id: "rec-1",
    inventory: null,
    recipe: {
      id: "rec-1",
      user_id: "user-1",
      name: "Pizza Dough",
      description: "Homemade pizza dough",
      units: 4,
      created_at: "2024-01-01",
      ingredients: [
        {
          id: "ri-1",
          recipe_id: "rec-1",
          inventory_id: "inv-flour",
          quantity: 500,
          unit: "g",
          inventory: {
            id: "inv-flour",
            name: "Flour",
            price_per_unit: "8.00",
            size: "1000",
            type: "dry",
            unit: "g",
            user_id: "user-1",
            quantity: "1000",
            count_date: "2024-01-01",
          },
        },
      ],
    },
  },
];

export const Default: Story = {
  args: {
    id: "dish-1",
    name: "Margherita Pizza",
    description: "Classic Italian pizza with fresh tomatoes and mozzarella",
    sellPrice: 18.99,
    ingredients: sampleIngredients,
    prepTime: "15m",
    instructions:
      "Prepare the dough\nAdd tomato sauce\nAdd mozzarella\nBake at 450°F for 12-15 minutes",
  },
};

export const Collapsed: Story = {
  args: {
    ...Default.args,
    isExpanded: false,
  },
};

export const HighMargin: Story = {
  args: {
    id: "dish-2",
    name: "Premium Pasta",
    description: "High-profit specialty pasta dish",
    sellPrice: 32.0,
    ingredients: [
      {
        id: "1",
        quantity: 200,
        unit: "g",
        inventory_id: "inv-pasta",
        recipe_id: null,
        inventory: {
          id: "inv-pasta",
          name: "Fresh Pasta",
          price_per_unit: "5.00",
          size: "500",
          type: "dry",
          unit: "g",
        },
        recipe: null,
      },
    ],
    prepTime: "10m",
  },
};

export const LowMargin: Story = {
  args: {
    id: "dish-3",
    name: "Budget Sandwich",
    description: "Low-margin item",
    sellPrice: 8.0,
    ingredients: [
      {
        id: "1",
        quantity: 2,
        unit: "slices",
        inventory_id: "inv-bread",
        recipe_id: null,
        inventory: {
          id: "inv-bread",
          name: "Artisan Bread",
          price_per_unit: "12.00",
          size: "10",
          type: "dry",
          unit: "slices",
        },
        recipe: null,
      },
    ],
  },
};

export const NoIngredients: Story = {
  args: {
    id: "dish-4",
    name: "Empty Dish",
    description: "A dish with no ingredients yet",
    sellPrice: 15.0,
    ingredients: [],
  },
};
