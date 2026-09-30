"use client";
import { useCallback, RefObject } from "react";

/**
 * A custom hook to scroll to a specific element safely without updating the URL hash.
 *
 * @param defaultOptions Optional default configurations extending native ScrollIntoViewOptions
 * @returns A reusable function to trigger the scroll transition
 */
export function useScrollToComponent(
  defaultOptions: ScrollIntoViewOptions = {},
) {
  const scrollTo = useCallback(
    (
      target: RefObject<HTMLElement | null> | HTMLElement | null,
      overrideOptions: ScrollIntoViewOptions = {},
    ): void => {
      // 1. Unify type checks to safely handle both React RefObjects and regular HTML Elements
      const element = target && "current" in target ? target.current : target;

      if (!element) {
        if (process.env.NODE_ENV !== "production") {
          console.warn(
            "useScrollToComponent: Target element is null or undefined.",
          );
        }
        return;
      }

      // 2. Safely merge configuration hierarchies
      const scrollOptions: ScrollIntoViewOptions = {
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
        ...defaultOptions,
        ...overrideOptions,
      };

      // 3. Native execution
      element.scrollIntoView(scrollOptions);
    },
    [defaultOptions],
  );

  return scrollTo;
}
