import {
  ClipboardCheck,
  ScanLine,
  UsersRound,
  History,
  TrendingUp,
  UserCheck,
  UserX,
} from "lucide-react";

import Link from "next/link";

interface AttendanceDashboardProps {
  totalStudents: number;
  presentToday: number;
  absentToday: number;
  attendancePercentage: number;
}

export function AttendanceDashboard({
  totalStudents,
  presentToday,
  absentToday,
  attendancePercentage,
}: AttendanceDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Students"
          value={totalStudents}
          icon={
            <UsersRound className="size-5" />
          }
        />

        <StatCard
          label="Present Today"
          value={presentToday}
          icon={
            <UserCheck className="size-5" />
          }
        />

        <StatCard
          label="Absent Today"
          value={absentToday}
          icon={
            <UserX className="size-5" />
          }
        />

        <StatCard
          label="Attendance"
          value={`${attendancePercentage}%`}
          icon={
            <TrendingUp className="size-5" />
          }
        />
      </div>

      {/* Attendance Actions */}
      <div>
        <h2 className="text-lg font-semibold">
          Take Attendance
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Choose how you want to record
          attendance.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <ActionCard
            href="/dashboard/academics/manual"
            icon={
              <ClipboardCheck className="size-6" />
            }
            title="Manual Attendance"
            description="Mark attendance manually."
          />

          <ActionCard
            href="/dashboard/academics/scan"
            icon={
              <ScanLine className="size-6" />
            }
            title="Campus Scan"
            description="Scan registration barcodes."
          />

          <ActionCard
            href="/dashboard/academics/class"
            icon={
              <UsersRound className="size-6" />
            }
            title="Class Attendance"
            description="Verify attendance during class."
          />
        </div>
      </div>

      {/* History */}
      <Link
        href="/dashboard/academics/history"
        className="flex items-center gap-4 rounded-xl border bg-white p-5 transition hover:shadow-md"
      >
        <div className="flex size-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <History className="size-5" />
        </div>

        <div>
          <h3 className="font-semibold">
            Attendance History
          </h3>

          <p className="text-sm text-muted-foreground">
            View and analyze attendance records.
          </p>
        </div>
      </Link>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Stat Card                                                                  */
/* -------------------------------------------------------------------------- */

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {label}
        </p>

        <div className="flex size-10 items-center justify-center rounded-lg bg-gray-100">
          {icon}
        </div>
      </div>

      <p className="mt-4 text-2xl font-bold">
        {value}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Action Card                                                                */
/* -------------------------------------------------------------------------- */

function ActionCard({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex size-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
        {icon}
      </div>

      <h3 className="mt-4 font-semibold group-hover:underline">
        {title}
      </h3>

      <p className="mt-1 text-sm text-muted-foreground">
        {description}
      </p>
    </Link>
  );
}