export interface ControlsBarProps {
  /** Search functionality */
  search?: {
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };

  /** View toggle functionality (card/table) */
  viewToggle?: {
    currentView: "card" | "table";
    onToggle: () => void;
  };

  /** Primary action button (usually create/add) */
  primaryAction?: {
    onPress: () => void;
    icon: string;
    label?: string;
  };

  /** Secondary action buttons */
  secondaryActions?: Array<{
    onPress: () => void;
    icon: string;
    label?: string;
    variant?: "ghost" | "solid";
  }>;

  /** Filter tags to display at the bottom */
  filterTags?: React.ReactNode;

  /** Additional CSS classes */
  className?: string;
}
