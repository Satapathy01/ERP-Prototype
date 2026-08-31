import { NextResponse } from "next/server";

import { getAuthenticationUser } from "~/modules/auth/auth.helper";
import { getTeachers } from "~/modules/teacher/teacher.service";

export async function GET() {
  try {
    const user = await getAuthenticationUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const teachers = await getTeachers(user.schoolId);
    return NextResponse.json({ success: true, data: teachers });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch teachers.",
      },
      { status: 500 },
    );
  }
}
