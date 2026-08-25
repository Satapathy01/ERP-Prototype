import { NextRequest, NextResponse } from "next/server";

import {
  examSessionService,
} from "@/modules/exams/sessions/exam-session.service";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const { id } =
      await context.params;

    const session =
      await examSessionService.getById(id);

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Examination session not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      session,
    });
  } catch (error) {
    console.error(
      "Get Exam Session Error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to load examination session.",
      },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const { id } =
      await context.params;

    const body =
      await request.json();

    const {
      name,
      code,
      academicYear,
      startsAt,
      endsAt,
    } = body;

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

    /*
     * Notice that ruleSetId and schoolId are
     * intentionally not accepted here.
     *
     * Once a session is created, its rule-set
     * version is fixed.
     */
    const session =
      await examSessionService.update(
        id,
        {
          name: name.trim(),

          code:
            code?.trim() || undefined,

          academicYear:
            academicYear?.trim() ||
            undefined,

          startsAt: startsAt
            ? new Date(startsAt)
            : undefined,

          endsAt: endsAt
            ? new Date(endsAt)
            : undefined,
        },
      );

    return NextResponse.json({
      success: true,
      session,
    });
  } catch (error) {
    console.error(
      "Update Exam Session Error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update examination session.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const { id } =
      await context.params;

    await examSessionService.delete(id);

    return NextResponse.json({
      success: true,
      message:
        "Examination session deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete Exam Session Error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to delete examination session.",
      },
      { status: 500 },
    );
  }
}