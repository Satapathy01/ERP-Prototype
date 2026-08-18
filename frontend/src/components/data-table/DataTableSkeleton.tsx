import { Skeleton } from "@/components/ui/skeleton";

interface DataTableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function DataTableSkeleton({
  rows = 8,
  columns = 6,
}: DataTableSkeletonProps) {
  return (
    <div className="rounded-md border">
      <div className="border-b p-4">
        <Skeleton className="h-9 w-72" />
      </div>

      <div className="divide-y">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid gap-4 p-4"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton
                key={colIndex}
                className="h-5 w-full"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}