"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const useUpdateSearchParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateSearchParams = (
    params: Record<string, string | string[] | undefined | null>,
    options?: { scroll?: boolean; replace?: boolean },
  ) => {
    // 1. Create a fresh URLSearchParams instance using the current active query strings
    const currentParams = new URLSearchParams(searchParams.toString());

    // 2. Loop through the updates and modify the params
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null || value === "") {
        // Clear the key if the value is empty/null/undefined
        currentParams.delete(key);
      } else if (Array.isArray(value)) {
        // For arrays, clear existing keys first, then append each value
        currentParams.delete(key);
        value.forEach((v) => currentParams.append(key, v));
      } else {
        // Standard set/overwrite for single strings
        currentParams.set(key, value);
      }
    }

    // 3. Construct the clean relative URL string
    const searchStr = currentParams.toString();
    const query = searchStr ? `?${searchStr}` : "";
    const targetUrl = `${pathname}${query}`;

    // 4. Navigate to the new URL using standard Next.js routing
    if (options?.replace) {
      router.replace(targetUrl, { scroll: options.scroll ?? false });
    } else {
      router.push(targetUrl, { scroll: options?.scroll ?? false });
    }
  };

  return updateSearchParams;
};

export default useUpdateSearchParams;
