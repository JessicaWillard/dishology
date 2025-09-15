export type NavItem = {
  id: string;
  label: string;
  icon: string;
  href?: string;
};

export interface NavBarProps {
  className?: string;
  items?: NavItem[];
  activeItemId?: string;
  onItemClick?: (itemId: string) => void;
}
