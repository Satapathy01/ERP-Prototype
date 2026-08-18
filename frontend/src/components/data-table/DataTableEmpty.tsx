import { SearchX } from "lucide-react";

interface DataTableEmptyProps {
  title?: string;
  description?: string;
}

export function DataTableEmpty({
  title = "No records found",
  description = "Try changing your search or filters.",
}: DataTableEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <SearchX className="mb-4 h-12 w-12 text-muted-foreground" />

      <h3 className="text-lg font-semibold">
        {title}
      </h3>

      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
}