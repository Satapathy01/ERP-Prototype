import { UsersIcon } from "lucide-react";
import { Button } from "~/components/ui/button";

export function UsersEmpty() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center">
      <UsersIcon className="mb-4 h-12 w-12 text-muted-foreground" />

      <h3 className="text-lg font-semibold">
        No users found
      </h3>

      <p className="mt-2 text-sm text-muted-foreground">
        Create your first user to get started.
      </p>

      <Button className="mt-6">
        Add User
      </Button>
    </div>
  );
}