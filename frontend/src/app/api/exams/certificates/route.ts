import { NextRequest, NextResponse } from "next/server";

import {
  certificateService,
} from "@/modules/exams/certificates/certificate.service";

/**
 * GET
 *
 * Supported:
 *
 * /api/exams/certificates?studentId=...
 *
 * /api/exams/certificates?sessionId=...
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

    if (studentId) {
      const certificates =
        await certificateService.getByStudent(
          studentId,
        );

      return NextResponse.json({
        success: true,
        certificates,
      });
    }

    if (sessionId) {
      const certificates =
        await certificateService.getBySession(
          sessionId,
        );

      return NextResponse.json({
        success: true,
        certificates,
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
      "Get Certificates Error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to load certificates.",
      },
      { status: 500 },
    );
  }
}

/**
 * POST
 *
 * Creates the certificate record after
 * successful graduation.
 */
export async function POST(
  request: NextRequest,
) {
  try {
    const body =
      await request.json();

    const {
      studentId,
      admissionId,
      sessionId,
      certificateNumber,
      certificateType,
      certificateFee,
      createdBy,
    } = body;

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

    if (!certificateNumber?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Certificate number is required.",
        },
        { status: 400 },
      );
    }

    const certificate =
      await certificateService.create(
        {
          studentId,

          admissionId:
            admissionId || undefined,

          sessionId,

          certificateNumber:
            certificateNumber.trim(),

          certificateType:
            certificateType?.trim() ||
            "COURSE_COMPLETION",

          certificateFee:
            certificateFee ??
            500,
        },
        createdBy || undefined,
      );

    return NextResponse.json(
      {
        success: true,
        certificate,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "Create Certificate Error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create certificate.",
      },
      { status: 500 },
    );
  }
}