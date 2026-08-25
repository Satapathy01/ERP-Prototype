import { NextRequest, NextResponse } from "next/server";

import {
  examService,
} from "@/modules/exams/exams/exam.service";

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

    const exam =
      await examService.getById(id);

    if (!exam) {
      return NextResponse.json(
        {
          success: false,
          message: "Exam not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      exam,
    });
  } catch (error) {
    console.error(
      "Get Exam Error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to load exam.",
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
      sessionId,
      courseId,
      name,
      code,
      type,
      maxMarks,
      passMarks,
      examDate,
      startTime,
      endTime,
      venue,
      instructions,
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

    if (!courseId) {
      return NextResponse.json(
        {
          success: false,
          message: "Course is required.",
        },
        { status: 400 },
      );
    }

    if (!name?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Exam name is required.",
        },
        { status: 400 },
      );
    }

    if (
      type !== "THEORY" &&
      type !== "PRACTICAL"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Exam type must be THEORY or PRACTICAL.",
        },
        { status: 400 },
      );
    }

    const exam =
      await examService.update(id, {
        sessionId,
        courseId,

        name: name.trim(),

        code:
          code?.trim() || undefined,

        type,

        maxMarks,
        passMarks,

        examDate: examDate
          ? new Date(examDate)
          : undefined,

        startTime: startTime
          ? new Date(startTime)
          : undefined,

        endTime: endTime
          ? new Date(endTime)
          : undefined,

        venue:
          venue?.trim() || undefined,

        instructions:
          instructions?.trim() ||
          undefined,
      });

    return NextResponse.json({
      success: true,
      exam,
    });
  } catch (error) {
    console.error(
      "Update Exam Error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update exam.",
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

    await examService.delete(id);

    return NextResponse.json({
      success: true,
      message:
        "Exam deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete Exam Error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to delete exam.",
      },
      { status: 500 },
    );
  }
}