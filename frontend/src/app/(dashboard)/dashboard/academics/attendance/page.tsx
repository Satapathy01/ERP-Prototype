import { AttendanceDashboard } from "@/components/attendance/AttendanceDashboard";

export default function AttendancePage() {
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
        totalStudents={0}
        presentToday={0}
        absentToday={0}
        attendancePercentage={0}
      />
    </main>
  );
}