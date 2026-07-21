import { Skeleton } from "~/components/ui/skeleton";

export function StudentsLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-80" />

      <div className="rounded-xl border p-4 space-y-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between"
          >
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}