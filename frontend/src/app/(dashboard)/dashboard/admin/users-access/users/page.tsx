import { getUsers } from "~/modules/users/users.service";

import { AddUserDialog } from "./_components/add-user-dialog";
import { UsersPagination } from "./_components/users-pagination";
import { UsersTable } from "./_components/users-table";
import { UsersToolbar } from "./_components/users-toolbar";

interface UsersPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export default async function UsersPage({
  searchParams,
}: UsersPageProps) {
  const params = await searchParams;

  const page = Number(params.page ?? "1");
  const search = params.search ?? "";

  const result = await getUsers({
    page,
    search,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage user accounts and access permissions.
          </p>
        </div>

        <AddUserDialog />
      </div>

      <UsersToolbar />

      {result.users.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
          No users found.
        </div>
      ) : (
        <>
          <UsersTable users={result.users} />
          <UsersPagination
            currentPage={result.currentPage}
            totalPages={result.totalPages}
            totalUsers={result.totalUsers}
          />
        </>
      )}
    </div>
  );
}