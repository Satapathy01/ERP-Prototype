import { NextRequest, NextResponse } from "next/server";

import {
  graduationService,
} from "@/modules/exams/graduation/graduation.service";

export async function GET(
  request: NextRequest,
) {
  try {
    const { searchParams } =
      new URL(request.url);

    const studentId =
      searchParams.get("studentId");

    const sessionId =
      searchParams.get("sessionId");

    if (!studentId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Student ID is required.",
        },
        { status: 400 },
      );
    }

    if (!sessionId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Examination session ID is required.",
        },
        { status: 400 },
      );
    }

    const result =
      await graduationService.evaluate(
        studentId,
        sessionId,
      );

    return NextResponse.json({
      success: true,
      graduation: result,
    });
  } catch (error) {
    console.error(
      "Graduation Evaluation Error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to evaluate graduation eligibility.",
      },
      { status: 500 },
    );
  }
}