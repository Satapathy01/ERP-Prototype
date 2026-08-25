import { NextRequest, NextResponse } from "next/server";

import {
  examEligibilityService,
} from "@/modules/exams/eligibility/eligibility.service";

import type {
  CourseAttendanceResult,
} from "@/modules/exams/eligibility/eligibility.types";

export async function POST(
  request: NextRequest,
) {
  try {
    const body = await request.json();

    const {
      studentId,
      sessionId,
      admissionId,
      courseAttendance,
    } = body;

    if (!studentId || !sessionId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Student and examination session are required.",
        },
        { status: 400 },
      );
    }

    /*
     * Attendance must come from the Attendance module.
     *
     * We don't calculate attendance here because
     * eligibility is responsible for applying the
     * rule, not owning attendance data.
     */
    if (!Array.isArray(courseAttendance)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Course attendance data is required.",
        },
        { status: 400 },
      );
    }

    const result =
      await examEligibilityService.evaluate(
        {
          studentId,
          sessionId,
          admissionId,
        },
        {
          courseAttendance:
            courseAttendance as CourseAttendanceResult[],
        },
      );

    return NextResponse.json(
      {
        success: true,
        ...result,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "Exam Eligibility Error:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unable to evaluate examination eligibility.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 },
    );
  }
}