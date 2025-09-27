"use client";

import { usePathname } from "next/navigation";
import { NavBar } from "./index";

const navItems = [
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
    href: "/recipes",
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

export const NavBarWrapper = () => {
  const pathname = usePathname();

  // Determine active item based on current path
  const getActiveItemId = () => {
    if (pathname === "/") return "dashboard";
    if (pathname === "/inventory") return "inventory";
    if (pathname === "/recipes") return "recipes";
    if (pathname === "/dishes") return "dishes";
    if (pathname === "/planning") return "planning";
    return "dashboard"; // default
  };

  return <NavBar activeItemId={getActiveItemId()} items={navItems} />;
};
