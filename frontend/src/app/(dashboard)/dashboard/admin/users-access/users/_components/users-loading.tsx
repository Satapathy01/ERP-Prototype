import { Skeleton } from "~/components/ui/skeleton";

export function UsersLoading() {
  return (
    <div className="overflow-hidden rounded-xl border">
      {/* Table Header */}
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_80px] gap-4 border-b bg-muted/50 px-4 py-3">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-5 ml-auto" />
      </div>

      {/* Rows */}
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-[2fr_1fr_1fr_1fr_80px] items-center gap-4 border-b px-4 py-4 last:border-none"
        >
          {/* User */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />

            <div className="space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-52" />
            </div>
          </div>

          {/* Role */}
          <Skeleton className="h-6 w-24 rounded-full" />

          {/* Status */}
          <Skeleton className="h-6 w-20 rounded-full" />

          {/* Last Login */}
          <Skeleton className="h-4 w-24" />

          {/* Actions */}
          <Skeleton className="ml-auto h-8 w-8 rounded-md" />
        </div>
      ))}
    </div>
  );
}