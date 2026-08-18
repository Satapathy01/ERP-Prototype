import { Button } from "~/components/ui/button";

interface UsersPaginationProps {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
}

export function UsersPagination({
  currentPage,
  totalPages,
  totalUsers,
}: UsersPaginationProps) {
  return (
    <div className="flex items-center justify-between border-t px-6 py-4">
      <p className="text-sm text-muted-foreground">
        Showing page <strong>{currentPage}</strong> of{" "}
        <strong>{totalPages}</strong> ({totalUsers} users)
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
        >
          Previous
        </Button>

        <Button size="sm">{currentPage}</Button>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}