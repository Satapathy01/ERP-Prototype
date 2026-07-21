import {
  ShieldCheckIcon,
  UsersIcon,
  GraduationCapIcon,
  UserCheckIcon,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

const stats = [
  {
    title: "Total Users",
    value: "25",
    icon: UsersIcon,
  },
  {
    title: "Active Users",
    value: "22",
    icon: UserCheckIcon,
  },
  {
    title: "Teachers",
    value: "8",
    icon: GraduationCapIcon,
  },
  {
    title: "Administrators",
    value: "2",
    icon: ShieldCheckIcon,
  },
];

export function UsersStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>

            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-3xl font-bold">
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}