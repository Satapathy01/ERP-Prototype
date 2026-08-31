import { AttendanceWorkspace } from "@/components/attendance/AttendanceWorkspace";

export default function ClassAttendancePage() {
	return (
		<main className="space-y-6 p-6">
			<h1 className="text-2xl font-bold">Class Attendance</h1>
			<p className="text-muted-foreground">
				Class attendance is recorded separately for each batch section.
			</p>
			<AttendanceWorkspace />
		</main>
	);
}
