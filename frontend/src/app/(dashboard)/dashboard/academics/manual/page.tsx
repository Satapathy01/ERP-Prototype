import { AttendanceWorkspace } from "@/components/attendance/AttendanceWorkspace";

export default function ManualAttendancePage() {
	return (
		<main className="space-y-6 p-6">
			<h1 className="text-2xl font-bold">Manual Attendance</h1>
			<p className="text-muted-foreground">
				Select a course, batch, and Theory or Practical section to record attendance.
			</p>
			<AttendanceWorkspace source="MANUAL" />
		</main>
	);
}
