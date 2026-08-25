import { NextRequest, NextResponse } from "next/server";

import {
  examService,
} from "@/modules/exams/exams/exam.service";

function combineDateAndTime(
  date: string | undefined,
  time: string | undefined,
) {
  if (!date || !time) {
    return undefined;
  }

  const [hours, minutes] =
    time.split(":").map(Number);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes)
  ) {
    return undefined;
  }

  const result = new Date(date);

  result.setHours(
    hours,
    minutes,
    0,
    0,
  );

  return result;
}

export async function GET(
  request: NextRequest,
) {
  try {
    const { searchParams } =
      new URL(request.url);

    const sessionId =
      searchParams.get("sessionId");

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

    const exams =
      await examService.getBySession(
        sessionId,
      );

    return NextResponse.json({
      success: true,
      exams,
    });
  } catch (error) {
    console.error(
      "Get Exams Error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to load examinations.",
      },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
) {
  try {
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

    if (
      maxMarks === undefined ||
      maxMarks === null ||
      Number(maxMarks) <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Maximum marks must be greater than zero.",
        },
        { status: 400 },
      );
    }

    if (
      passMarks === undefined ||
      passMarks === null ||
      Number(passMarks) < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Pass marks are required.",
        },
        { status: 400 },
      );
    }

    if (
      Number(passMarks) >
      Number(maxMarks)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Pass marks cannot exceed maximum marks.",
        },
        { status: 400 },
      );
    }

    if (!examDate) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Examination date is required.",
        },
        { status: 400 },
      );
    }

    const parsedExamDate =
      new Date(examDate);

    if (
      Number.isNaN(
        parsedExamDate.getTime(),
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid examination date.",
        },
        { status: 400 },
      );
    }

    const parsedStartTime =
      combineDateAndTime(
        examDate,
        startTime,
      );

    const parsedEndTime =
      combineDateAndTime(
        examDate,
        endTime,
      );

    if (
      parsedStartTime &&
      parsedEndTime &&
      parsedEndTime <= parsedStartTime
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "End time must be after start time.",
        },
        { status: 400 },
      );
    }

    const exam =
      await examService.create({
        sessionId,

        courseId,

        name: name.trim(),

        code:
          code?.trim() || undefined,

        type,

        maxMarks: Number(maxMarks),

        passMarks: Number(passMarks),

        examDate:
          parsedExamDate,

        startTime:
          parsedStartTime,

        endTime:
          parsedEndTime,

        venue:
          venue?.trim() || undefined,

        instructions:
          instructions?.trim() ||
          undefined,
      });

    return NextResponse.json(
      {
        success: true,
        exam,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "Create Exam Error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create examination.",
      },
      { status: 500 },
    );
  }
}