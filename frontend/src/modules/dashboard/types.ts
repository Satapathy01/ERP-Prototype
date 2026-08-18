export interface DashboardStats {
  students: number;
  staff: number;
  imports: number;
  revenue: number;
}

export interface DashboardOverview {
  stats: DashboardStats;
}// src/modules/dashboard/types.ts

export interface DashboardStats {
  students: number;
  staff: number;
  imports: number;
  revenue: number;
}

export interface DashboardOverview {
  stats: DashboardStats;
}

export interface RecentPayment {
  id: string;
  studentName: string;
  receiptNumber: string | null;
  amountPaid: number;
  paymentMethod: string;
  receiptDate: Date | null;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export interface AttendanceSummary {
  present: number;
  absent: number;
  percentage: number;
}

export interface DashboardResponse {
  stats: DashboardStats;
  recentPayments: RecentPayment[];
  monthlyRevenue: MonthlyRevenue[];
  attendance?: AttendanceSummary;
}