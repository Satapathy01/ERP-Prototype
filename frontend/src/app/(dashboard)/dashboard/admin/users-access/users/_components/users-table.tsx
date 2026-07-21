import { UserRole } from "@prisma/client";

import { Avatar, AvatarFallback } from "~/components/ui/avatar";

import { RoleBadge } from "./role-badge";
import { StatusBadge } from "./status-badge";
import { UserActions } from "./user-actions";

interface User {
  id: string;
  schoolId: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface UsersTableProps {
  users: User[];
}

export function UsersTable({ users }: UsersTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border">
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr className="border-b">
            <th className="px-4 py-3 text-left font-medium">User</th>
            <th className="px-4 py-3 text-left font-medium">Role</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-left font-medium">
              Created
            </th>
            <th className="w-16 px-4 py-3"></th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => {
            const initials = user.name
              .split(" ")
              .map((word) => word.charAt(0))
              .join("")
              .toUpperCase();

            return (
              <tr
                key={user.id}
                className="border-b transition-colors hover:bg-muted/30 last:border-none"
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>

                    <div>
                      <p className="font-medium">{user.name}</p>

                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-4">
                  <RoleBadge role={user.role} />
                </td>

                <td className="px-4 py-4">
                  <StatusBadge
                    status={user.isActive ? "Active" : "Inactive"}
                  />
                </td>

                <td className="px-4 py-4 text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>

                <td className="px-4 py-4">
                  <UserActions user={user} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}