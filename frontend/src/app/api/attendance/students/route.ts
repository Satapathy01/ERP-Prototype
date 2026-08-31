import { NextResponse } from "next/server";

import { getAuthenticationUser } from "~/modules/auth/auth.helper";
import { attendanceService } from "~/modules/attendance/attendance.service";

export async function GET(request: Request) {
  try {
    const user = await getAuthenticationUser();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const params = new URL(request.url).searchParams;
    const courseId = params.get("courseId");
    const batchId = params.get("batchId");
    const sectionType = params.get("sectionType");
    const dateParam = params.get("date");
    if (!courseId || !batchId) {
      return NextResponse.json({ success: false, message: "Course and batch are required." }, { status: 400 });
    }

    const validSection = sectionType === "THEORY" || sectionType === "PRACTICAL" ? sectionType : undefined;
    const date = dateParam ? new Date(dateParam) : undefined;
    const admissions = await attendanceService.getBatchStudents(user.schoolId, courseId, batchId, validSection, date);
    return NextResponse.json({ success: true, data: admissions.map((admission) => ({ ...admission.student, status: admission.status, remarks: admission.remarks })) });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed to fetch batch students." },
      { status: 400 },
    );
  }
}