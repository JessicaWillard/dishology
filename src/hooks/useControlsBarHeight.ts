import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Custom hook to measure the height of the ControlsBar component
 * Returns the height in pixels, a ref to attach to the ControlsBar, and a method to force update
 */
export function useControlsBarHeight() {
  // Get responsive default height
  const getDefaultHeight = () => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768 ? 140 : 160; // Mobile: 140px, Desktop: 160px
    }
    return 160; // Server-side default
  };

  const [height, setHeight] = useState(getDefaultHeight);
  const controlsBarRef = useRef<HTMLDivElement>(null);

  const updateHeight = useCallback(() => {
    if (controlsBarRef.current) {
      // Force a reflow to ensure accurate measurements
      void controlsBarRef.current.offsetHeight;

      // Try multiple methods to get the height
      const rect = controlsBarRef.current.getBoundingClientRect();
      const offsetHeight = controlsBarRef.current.offsetHeight;
      const scrollHeight = controlsBarRef.current.scrollHeight;

      const newHeight = Math.max(rect.height, offsetHeight, scrollHeight);

      // Always update if we get any height measurement (even if it's the same)
      if (newHeight > 0) {
        setHeight(newHeight);
      }
    }
  }, [height]);

  // Initial measurement when component mounts and on navigation
  useEffect(() => {
    const measureHeight = () => {
      if (controlsBarRef.current) {
        updateHeight();
      }
    };

    // Multiple attempts to ensure we catch the height after navigation
    const timeouts = [
      setTimeout(measureHeight, 0),
      setTimeout(measureHeight, 10),
      setTimeout(measureHeight, 50),
      setTimeout(measureHeight, 100),
      setTimeout(measureHeight, 200),
      setTimeout(measureHeight, 500),
    ];

    // Use requestAnimationFrame for immediate measurement
    const rafId = requestAnimationFrame(measureHeight);

    // Listen for window resize events
    window.addEventListener("resize", updateHeight);

    return () => {
      timeouts.forEach(clearTimeout);
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", updateHeight);
    };
  }, [updateHeight]);

  // Recalculate height when the component becomes visible (navigation)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && controlsBarRef.current) {
        // Small delay to ensure DOM is ready after navigation
        setTimeout(updateHeight, 100);
      }
    };

    // Use Intersection Observer to detect when component comes into view
    let observer: IntersectionObserver | null = null;

    if (controlsBarRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Component is visible, recalculate height
              setTimeout(updateHeight, 50);
            }
          });
        },
        { threshold: 0.1 }
      );

      observer.observe(controlsBarRef.current);
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (observer) {
        observer.disconnect();
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [updateHeight]);

  // Update default height when window size changes
  useEffect(() => {
    const handleResize = () => {
      const newDefaultHeight = getDefaultHeight();
      setHeight((prevHeight) => {
        // Only update if we haven't measured the actual height yet
        // or if the current height is close to the previous default
        if (prevHeight === 140 || prevHeight === 160) {
          return newDefaultHeight;
        }
        return prevHeight;
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Update height when the ref changes
  useEffect(() => {
    if (controlsBarRef.current) {
      updateHeight();
    }
  }, [updateHeight]);

  // Expose a method to manually trigger height update
  const forceUpdateHeight = useCallback(() => {
    updateHeight();
  }, [updateHeight]);

  return { height, controlsBarRef, forceUpdateHeight };
}
