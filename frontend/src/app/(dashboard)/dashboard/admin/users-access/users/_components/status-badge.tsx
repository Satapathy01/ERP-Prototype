import { Badge } from "~/components/ui/badge";

type Props = {
  status: "Active" | "Inactive";
};

export function StatusBadge({ status }: Props) {
  const active = status === "Active";

  return (
    <Badge variant={active ? "default" : "secondary"}>
      {status}
    </Badge>
  );
}