import { AttendanceDashboard } from "@/components/attendance/AttendanceDashboard";
import { getAuthenticationUser } from "~/modules/auth/auth.helper";
import { attendanceService } from "~/modules/attendance/attendance.service";

export const dynamic = "force-dynamic";

export default async function AttendancePage() {
  const user = await getAuthenticationUser();
  const summary = user
    ? await attendanceService.getDashboardSummary(user.schoolId)
    : { totalStudents: 0, presentToday: 0, absentToday: 0, attendancePercentage: 0 };

  return (
    <main className="space-y-6 p-6">
      <div>
        <p className="text-sm text-muted-foreground">
          Academic Administration
        </p>

        <h1 className="text-2xl font-bold">
          Attendance
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage student attendance, campus scans,
          and class attendance.
        </p>
      </div>

      <AttendanceDashboard
        totalStudents={summary.totalStudents}
        presentToday={summary.presentToday}
        absentToday={summary.absentToday}
        attendancePercentage={summary.attendancePercentage}
      />
    </main>
  );
}