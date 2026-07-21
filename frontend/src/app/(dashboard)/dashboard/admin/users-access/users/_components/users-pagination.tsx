import { Button } from "~/components/ui/button";

export function UsersPagination() {
  return (
    <div className="flex items-center justify-between border-t px-6 py-4">
      <p className="text-sm text-muted-foreground">
        Showing <strong>1–10</strong> of <strong>56</strong> users
      </p>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          Previous
        </Button>

        <Button size="sm">1</Button>

        <Button variant="outline" size="sm">
          2
        </Button>

        <Button variant="outline" size="sm">
          3
        </Button>

        <Button variant="outline" size="sm">
          Next
        </Button>
      </div>
    </div>
  );
}