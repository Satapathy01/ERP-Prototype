import { useQuery } from "@tanstack/react-query";

export function useBatches(courseId?: string) {
  return useQuery({
    queryKey: ["batches", courseId],

    enabled: !!courseId,

    queryFn: async () => {
      const res = await fetch(`/api/batches?courseId=${courseId}`);

      if (!res.ok) {
        throw new Error("Failed to load batches");
      }

      return res.json();
    },
  });
}