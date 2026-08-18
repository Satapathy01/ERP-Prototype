import { useQuery } from "@tanstack/react-query";

import type {
  AdmissionSearchResult,
} from "@/modules/finance/services/types";

export function useAdmissionSearch(search: string) {
  return useQuery<AdmissionSearchResult[]>({
    queryKey: ["admission-search", search],

    enabled: search.trim().length >= 2,

    queryFn: async (): Promise<
      AdmissionSearchResult[]
    > => {
      const response = await fetch(
        `/api/admissions/search?q=${encodeURIComponent(
          search.trim()
        )}`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to search admissions"
        );
      }

      return response.json();
    },
  });
}