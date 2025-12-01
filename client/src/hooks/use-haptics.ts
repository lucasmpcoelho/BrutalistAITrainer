import { useCallback } from "react";

type HapticFeedbackType = "light" | "medium" | "heavy" | "success" | "warning" | "error";

interface HapticPattern {
  pattern: number[];
  duration?: number;
}

const HAPTIC_PATTERNS: Record<HapticFeedbackType, HapticPattern> = {
  light: { pattern: [10] },
  medium: { pattern: [20] },
  heavy: { pattern: [30] },
  success: { pattern: [10, 50, 10] },
  warning: { pattern: [20, 50, 20] },
  error: { pattern: [30, 50, 30, 50, 30] },
};

/**
 * Hook for providing haptic feedback on supported devices
 * Falls back gracefully on devices that don't support vibration API
 */
export function useHaptics() {
  const vibrate = useCallback((type: HapticFeedbackType | number | number[] = "medium") => {
    // Check if Vibration API is supported
    if (!("vibrate" in navigator)) {
      return;
    }

    try {
      let pattern: number[];

      if (typeof type === "number") {
        // Direct duration in milliseconds
        pattern = [type];
      } else if (Array.isArray(type)) {
        // Custom pattern array
        pattern = type;
      } else {
        // Named pattern
        pattern = HAPTIC_PATTERNS[type].pattern;
      }

      navigator.vibrate(pattern);
    } catch (error) {
      // Silently fail if vibration is not supported or blocked
      console.debug("Haptic feedback not available:", error);
    }
  }, []);

  const cancel = useCallback(() => {
    if ("vibrate" in navigator) {
      try {
        navigator.vibrate(0);
      } catch (error) {
        console.debug("Failed to cancel haptic feedback:", error);
      }
    }
  }, []);

  return {
    vibrate,
    cancel,
    /**
     * Check if haptic feedback is supported on this device
     */
    isSupported: "vibrate" in navigator,
  };
}


