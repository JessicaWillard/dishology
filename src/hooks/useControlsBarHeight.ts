import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Custom hook to measure the height of the ControlsBar component
 * Returns the height in pixels, a ref to attach to the ControlsBar, and a method to force update
 */
export function useControlsBarHeight() {
  const [height, setHeight] = useState(140); // Start with a reasonable default
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

  // Initial measurement when component mounts
  useEffect(() => {
    let hasMeasured = false;

    const measureHeight = () => {
      if (controlsBarRef.current && !hasMeasured) {
        updateHeight();
        hasMeasured = true; // Stop further attempts once we get a measurement
      }
    };

    // Optimized timing - only a few attempts since measurement succeeds quickly
    const timeouts = [
      setTimeout(measureHeight, 0),
      setTimeout(measureHeight, 10),
      setTimeout(measureHeight, 50),
      setTimeout(measureHeight, 200),
      setTimeout(measureHeight, 500),
      setTimeout(measureHeight, 1000),
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
