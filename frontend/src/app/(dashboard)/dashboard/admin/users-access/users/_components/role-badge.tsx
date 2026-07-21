import { UserRole } from "@prisma/client";

import { Badge } from "~/components/ui/badge";

type Props = {
  role: UserRole;
};

export function RoleBadge({ role }: Props) {
  switch (role) {
    case UserRole.ADMIN:
      return <Badge variant="destructive">Admin</Badge>;

    case UserRole.STAFF:
      return <Badge>Staff</Badge>;

    default:
      return <Badge>{role}</Badge>;
  }
}