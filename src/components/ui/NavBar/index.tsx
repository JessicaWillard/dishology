"use client";

import React from "react";
import { Icon } from "../Icon";
import type { NavBarProps } from "./interface";
import { Box } from "../Box";
import { tv } from "tailwind-variants";

const navBarStyles = tv({
  base: "fixed bottom-0 left-0 right-0 bg-white/40 backdrop-blur-sm max-w-7xl mx-auto p-4 sm:p-6 lg:p-8",
});

const defaultNavItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "Dashboard",
    href: "/",
  },
  {
    id: "inventory",
    label: "Inventory",
    icon: "Ingredient",
    href: "/inventory",
  },
  {
    id: "recipes",
    label: "Recipes",
    icon: "Recipe",
  },
  {
    id: "dishes",
    label: "Dishes",
    icon: "Dish",
  },
  {
    id: "planning",
    label: "Planning",
    icon: "Calendar",
  },
];

export const NavBar: React.FC<NavBarProps> = ({
  className = "",
  items = defaultNavItems,
  activeItemId,
  onItemClick,
}) => {
  const handleItemClick = (itemId: string) => {
    if (onItemClick) {
      onItemClick(itemId);
    }
  };

  return (
    <nav className={navBarStyles({ className })}>
      <Box display="flexRow" gap={4} justify="between">
        {items.map((item) => {
          const isActive = activeItemId === item.id;
          const baseClasses =
            "flex flex-col items-center gap-1 px-2 py-1 rounded-lg transition-colors";
          const activeClasses = isActive
            ? "text-black"
            : "text-primary hover:text-black";

          if (item.href) {
            return (
              <a
                key={item.id}
                href={item.href}
                className={`${baseClasses} ${activeClasses}`}
              >
                <Icon name={item.icon} className="h-5 w-5" />
                <span className="text-xs">{item.label}</span>
              </a>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`${baseClasses} ${activeClasses}`}
            >
              <Icon name={item.icon} className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </Box>
    </nav>
  );
};

NavBar.displayName = "NavBar";

export default NavBar;
