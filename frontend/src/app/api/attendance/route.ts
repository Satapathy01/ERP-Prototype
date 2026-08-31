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
    const records = await attendanceService.getAttendance(user.schoolId, query);

    return NextResponse.json({ success: true, data: records });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed to fetch attendance." },
      { status: 400 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticationUser();

    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const records = body.source === "MANUAL"
      ? await attendanceService.markManualAttendance(user.schoolId, user.userId, body)
      : await attendanceService.markClassAttendance(user.schoolId, user.userId, body);

    return NextResponse.json({ success: true, data: records });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed to save attendance." },
      { status: 400 },
    );
  }
}
