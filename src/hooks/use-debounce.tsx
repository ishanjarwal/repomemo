"use client";
import { useEffect, useRef, useState } from "react";

export function useDebounce<T>(value: T, delay = 250, enabled = true): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled) {
      setDebouncedValue(value);
      return;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setDebouncedValue((prev) => (Object.is(prev, value) ? prev : value));
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [value, delay, enabled]);

  return debouncedValue;
}
