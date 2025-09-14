import { Box } from "../Box";
import { Button } from "../Button";
import { Input } from "../../fields/Input";
import { Icon } from "../Icon";
import type { ControlsBarProps } from "./interface";
import { tv } from "tailwind-variants";
import { clsx } from "clsx";

const controlsBarStyles = tv({
  base: "bg-white/40 backdrop-blur-sm flex-wrap z-10 max-w-7xl mx-auto left-0 right-0 p-4 sm:p-6 lg:p-8",
});

export function ControlsBar({
  search,
  viewToggle,
  primaryAction,
  secondaryActions = [],
  className,
}: ControlsBarProps) {
  // Determine if we have multiple items to justify between
  const hasLeftItems = viewToggle;
  const hasRightItems = primaryAction || secondaryActions.length > 0;
  const hasMultipleItems = hasLeftItems && hasRightItems;

  return (
    <Box
      display="flexCol"
      gap={4}
      width="full"
      position="fixed"
      className={clsx(controlsBarStyles(), className)}
    >
      <Box display="flexCol" width="full" gap={4} className="z-20">
        {/* Top row with actions */}
        <Box
          display="flexRow"
          justify={hasMultipleItems ? "between" : "center"}
          align="center"
          gap="md"
        >
          {hasMultipleItems ? (
            <>
              {/* Left side - view toggle and other controls */}
              {viewToggle && (
                <Button
                  variant="ghost"
                  handlePress={viewToggle.onToggle}
                  iconOnly
                  aria-label={`Switch to ${
                    viewToggle.currentView === "card" ? "table" : "card"
                  } view`}
                >
                  <Icon
                    name={viewToggle.currentView === "card" ? "List" : "Grid"}
                  />
                </Button>
              )}

              {primaryAction && (
                <Button
                  variant="solid"
                  handlePress={primaryAction.onPress}
                  iconOnly
                  aria-label={primaryAction.label || "Primary action"}
                >
                  <Icon name={primaryAction.icon} />
                </Button>
              )}

              {secondaryActions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || "ghost"}
                  handlePress={action.onPress}
                  iconOnly
                  aria-label={action.label || `Action ${index + 1}`}
                >
                  <Icon name={action.icon} />
                </Button>
              ))}
            </>
          ) : (
            /* Single item - center it */
            <Box display="flexRow" gap={2}>
              {viewToggle && (
                <Button
                  variant="ghost"
                  handlePress={viewToggle.onToggle}
                  iconOnly
                  aria-label={`Switch to ${
                    viewToggle.currentView === "card" ? "table" : "card"
                  } view`}
                >
                  <Icon
                    name={viewToggle.currentView === "card" ? "List" : "Grid"}
                  />
                </Button>
              )}
              {primaryAction && (
                <Button
                  variant="solid"
                  handlePress={primaryAction.onPress}
                  iconOnly
                  aria-label={primaryAction.label || "Primary action"}
                >
                  <Icon name={primaryAction.icon} />
                </Button>
              )}
              {secondaryActions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || "ghost"}
                  handlePress={action.onPress}
                  iconOnly
                  aria-label={action.label || `Action ${index + 1}`}
                >
                  <Icon name={action.icon} />
                </Button>
              ))}
            </Box>
          )}
        </Box>

        {/* Search bar */}
        {search && (
          <Box width="full">
            <Input
              placeholder={search.placeholder}
              value={search.value}
              onChange={(value, e) => search.onChange(e)}
              rightIcon="Search"
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}

export { controlsBarStyles };
