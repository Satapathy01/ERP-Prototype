import { AttendanceHistoryWorkspace } from "@/components/attendance/AttendanceHistoryWorkspace";

export default function AttendanceHistoryPage() {
	return (
		<main className="space-y-4 p-6">
			<h1 className="text-2xl font-bold">Attendance History</h1>
			<p className="text-muted-foreground">
				Filter records by course, batch, section, date, or student.
			</p>
			<AttendanceHistoryWorkspace />
		</main>
	);
}
