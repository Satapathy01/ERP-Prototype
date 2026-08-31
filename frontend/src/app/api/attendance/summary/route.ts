import { NextResponse } from "next/server";

import { getAuthenticationUser } from "~/modules/auth/auth.helper";
import { attendanceService } from "~/modules/attendance/attendance.service";
import { attendanceQuerySchema } from "~/modules/attendance/attendance.schema";

export async function GET(request: Request) {
  try {
    const user = await getAuthenticationUser();

    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const params = Object.fromEntries(new URL(request.url).searchParams.entries());
    const query = attendanceQuerySchema.parse(params);
    const options = {
      studentId: query.studentId,
      courseId: query.courseId,
      batchId: query.batchId,
      from: query.from,
      to: query.to,
    };

    if (query.sectionType) {
      return NextResponse.json({
        success: true,
        sectionType: query.sectionType,
        summary: await attendanceService.getSummary(user.schoolId, {
          ...options,
          sectionType: query.sectionType,
        }),
      });
    }

    const [theory, practical] = await Promise.all([
      attendanceService.getSummary(user.schoolId, { ...options, sectionType: "THEORY" }),
      attendanceService.getSummary(user.schoolId, { ...options, sectionType: "PRACTICAL" }),
    ]);

    return NextResponse.json({
      success: true,
      summaries: { theory, practical },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed to calculate attendance." },
      { status: 400 },
    );
  }
}
