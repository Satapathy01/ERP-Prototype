import { NextRequest, NextResponse } from "next/server";

import {
  examSessionService,
} from "@/modules/exams/sessions/exam-session.service";

import { SCHOOL_ID } from "@/lib/school";

/**
 * GET
 *
 * Returns all examination sessions
 * belonging to the configured school.
 *
 * School ID comes from:
 *
 * SCHOOL_ID in .env
 */
export async function GET() {
  try {
    const sessions =
      await examSessionService.getAll(
        SCHOOL_ID,
      );

    return NextResponse.json({
      success: true,
      sessions,
    });
  } catch (error) {
    console.error(
      "Get Exam Sessions Error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to load examination sessions.",
      },
      { status: 500 },
    );
  }
}

/**
 * POST
 *
 * Creates a new examination session.
 *
 * School ID is automatically taken from
 * SCHOOL_ID in .env.
 */
export async function POST(
  request: NextRequest,
) {
  try {
    const body =
      await request.json();

    const {
      name,
      code,
      academicYear,
      ruleSetId,
      startsAt,
      endsAt,
    } = body;

    /*
     * -----------------------------------------
     * Validation
     * -----------------------------------------
     */

    if (!name?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Examination session name is required.",
        },
        { status: 400 },
      );
    }

    if (!ruleSetId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Examination rule set is required.",
        },
        { status: 400 },
      );
    }

    /*
     * -----------------------------------------
     * Create session
     * -----------------------------------------
     *
     * schoolId is NOT accepted from the client.
     * It always comes from .env.
     */

    const session =
      await examSessionService.create({
        schoolId: SCHOOL_ID,

        name: name.trim(),

        code:
          code?.trim() || undefined,

        academicYear:
          academicYear?.trim() ||
          undefined,

        ruleSetId,

        startsAt: startsAt
          ? new Date(startsAt)
          : undefined,

        endsAt: endsAt
          ? new Date(endsAt)
          : undefined,
      });

    return NextResponse.json(
      {
        success: true,
        session,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "Create Exam Session Error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create examination session.",
      },
      { status: 500 },
    );
  }
}