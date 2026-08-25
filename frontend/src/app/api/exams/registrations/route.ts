import { NextRequest, NextResponse } from "next/server";

import {
  examRegistrationService,
} from "@/modules/exams/registration/registration.service";

/**
 * GET
 *
 * Supported:
 *
 * /api/exams/registrations?sessionId=...
 *
 * /api/exams/registrations?studentId=...
 *
 * /api/exams/registrations?studentId=...&sessionId=...
 */
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

    /*
     * Student registrations
     */
    if (studentId) {
      const registrations =
        await examRegistrationService.getByStudent(
          studentId,
          sessionId ?? undefined,
        );

      return NextResponse.json({
        success: true,
        registrations,
      });
    }

    /*
     * Session registrations
     */
    if (sessionId) {
      const registrations =
        await examRegistrationService.getBySession(
          sessionId,
        );

      return NextResponse.json({
        success: true,
        registrations,
      });
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "studentId or sessionId is required.",
      },
      { status: 400 },
    );
  } catch (error) {
    console.error(
      "Get Exam Registrations Error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to load exam registrations.",
      },
      { status: 500 },
    );
  }
}

/**
 * POST
 *
 * Register one student for:
 *
 * 1. One exam
 *
 * OR
 *
 * 2. All exams in a session
 *
 * Single exam:
 *
 * {
 *   sessionId,
 *   examId,
 *   studentId,
 *   admissionId
 * }
 *
 * Complete session:
 *
 * {
 *   sessionId,
 *   studentId,
 *   admissionId,
 *   registerAll: true
 * }
 */
export async function POST(
  request: NextRequest,
) {
  try {
    const body =
      await request.json();

    const {
      sessionId,
      examId,
      studentId,
      admissionId,
      registerAll,
    } = body;

    if (!sessionId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Examination session is required.",
        },
        { status: 400 },
      );
    }

    if (!studentId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Student is required.",
        },
        { status: 400 },
      );
    }

    /*
     * Register student for every exam
     * in the session.
     */
    if (registerAll === true) {
      const registrations =
        await examRegistrationService.registerStudentForSession(
          {
            sessionId,
            studentId,
            admissionId:
              admissionId || undefined,
          },
        );

      return NextResponse.json(
        {
          success: true,
          registrations,
        },
        { status: 201 },
      );
    }

    /*
     * Register student for one exam.
     */
    if (!examId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Exam is required.",
        },
        { status: 400 },
      );
    }

    const registration =
      await examRegistrationService.register(
        {
          sessionId,
          examId,
          studentId,
          admissionId:
            admissionId || undefined,
        },
      );

    return NextResponse.json(
      {
        success: true,
        registration,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "Create Exam Registration Error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to register student for examination.",
      },
      { status: 500 },
    );
  }
}