import { NextRequest, NextResponse } from "next/server";

import {
  examResultService,
} from "@/modules/exams/results/result.service";

export async function GET(
  request: NextRequest,
) {
  try {
    const { searchParams } =
      new URL(request.url);

    const registrationId =
      searchParams.get("registrationId");

    const studentId =
      searchParams.get("studentId");

    const sessionId =
      searchParams.get("sessionId");

    /*
     * Get result for one registration.
     */
    if (registrationId) {
      const result =
        await examResultService.getByRegistration(
          registrationId,
        );

      if (!result) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Exam result not found.",
          },
          { status: 404 },
        );
      }

      return NextResponse.json({
        success: true,
        result,
      });
    }

    /*
     * Get all results for a student
     * in an examination session.
     */
    if (studentId && sessionId) {
      const results =
        await examResultService.getStudentResults(
          studentId,
          sessionId,
        );

      return NextResponse.json({
        success: true,
        results,
      });
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "registrationId or studentId with sessionId is required.",
      },
      { status: 400 },
    );
  } catch (error) {
    console.error(
      "Get Exam Results Error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to load examination results.",
      },
      { status: 500 },
    );
  }
}

/**
 * Enter or update an examination result.
 */
export async function POST(
  request: NextRequest,
) {
  try {
    const body =
      await request.json();

    const {
      registrationId,
      marksObtained,
      remarks,
    } = body;

    if (!registrationId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Exam registration is required.",
        },
        { status: 400 },
      );
    }

    if (
      marksObtained === undefined ||
      marksObtained === null ||
      marksObtained === ""
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Marks obtained are required.",
        },
        { status: 400 },
      );
    }

    const result =
      await examResultService.save({
        registrationId,
        marksObtained,
        remarks:
          remarks?.trim() || undefined,
      });

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error(
      "Save Exam Result Error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to save examination result.",
      },
      { status: 500 },
    );
  }
}