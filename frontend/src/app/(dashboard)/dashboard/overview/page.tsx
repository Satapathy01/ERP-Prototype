import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RevenueChart from "@/components/dashboard/RevenueChart";
import RecentPayments from "@/components/dashboard/RecentPayments";
import NoticeBoard from "@/components/dashboard/NoticeBoard";
import QuickActions from "@/components/dashboard/QuickActions";

import { getDashboardOverview } from "@/modules/dashboard/service";

export default async function OverviewPage() {
  const dashboard = await getDashboardOverview();

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Dashboard Overview"
        subtitle="Welcome back!"
      />

      <DashboardStats stats={dashboard.stats} />

      <RevenueChart />

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentPayments />
        <NoticeBoard />
      </div>

      <QuickActions />
    </div>
  );
}