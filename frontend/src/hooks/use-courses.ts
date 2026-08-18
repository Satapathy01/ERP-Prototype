import { useQuery } from "@tanstack/react-query";

export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const res = await fetch("/api/courses");

      if (!res.ok) {
        throw new Error("Failed to load courses");
      }

      return res.json();
    },
  });
}