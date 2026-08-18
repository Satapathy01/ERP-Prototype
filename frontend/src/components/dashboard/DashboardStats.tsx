"use client";

import {
  Users,
  UserCog,
  FolderInput,
  IndianRupee,
} from "lucide-react";

import StatsCard from "@/components/dashboard/StatsCard";

export interface DashboardStatsProps {
  stats: {
    students: number;
    staff: number;
    imports: number;
    revenue: number;
  };
}

export default function DashboardStats({
  stats,
}: DashboardStatsProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <StatsCard
        title="Students"
        value={stats.students}
        icon={Users}
        color="bg-blue-500"
      />

      <StatsCard
        title="Staff"
        value={stats.staff}
        icon={UserCog}
        color="bg-green-500"
      />

      <StatsCard
        title="Imports"
        value={stats.imports}
        icon={FolderInput}
        color="bg-orange-500"
      />

      <StatsCard
        title="Revenue"
        value={`₹${stats.revenue.toLocaleString()}`}
        icon={IndianRupee}
        color="bg-purple-500"
      />
    </div>
  );
}