import { Badge } from "@/components/ui/badge";

interface RoleBadgeProps {
  role: string;
}

export function RoleBadge({
  role,
}: RoleBadgeProps) {
  return (
    <Badge variant="secondary">
      {role}
    </Badge>
  );
}
