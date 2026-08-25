"use server";

import {
  examSchema,
} from "./exam.schema";

import {
  examService,
} from "./exam.service";

interface CreateExamValues {
  sessionId: string;
  courseId: string;
  name: string;
  code?: string;
  type: "THEORY" | "PRACTICAL";
  maxMarks: number;
  passMarks: number;
  examDate?: string;
  startTime?: string;
  endTime?: string;
  venue?: string;
  instructions?: string;
}

/**
 * Convert a YYYY-MM-DD string into a Date.
 */
function parseDate(
  value?: string,
) {
  if (!value) {
    return undefined;
  }

  const date =
    new Date(`${value}T00:00:00`);

  return Number.isNaN(
    date.getTime(),
  )
    ? undefined
    : date;
}

/**
 * Convert HH:mm into a Date.
 *
 * The database stores start/end time as DateTime,
 * so we use today's date as the date component.
 * The actual exam date remains stored separately
 * in examDate.
 */
function parseTime(
  value?: string,
) {
  if (!value) {
    return undefined;
  }

  const match =
    /^(\d{2}):(\d{2})$/.exec(
      value,
    );

  if (!match) {
    return undefined;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (
    hours > 23 ||
    minutes > 59
  ) {
    return undefined;
  }

  const date = new Date();

  date.setHours(
    hours,
    minutes,
    0,
    0,
  );

  return date;
}

export async function createExam(
  values: CreateExamValues,
) {
  const parsed =
    examSchema.safeParse({
      sessionId:
        values.sessionId,

      courseId:
        values.courseId,

      name:
        values.name,

      code:
        values.code || undefined,

      type:
        values.type,

      maxMarks:
        values.maxMarks,

      passMarks:
        values.passMarks,

      examDate:
        parseDate(
          values.examDate,
        ),

      startTime:
        parseTime(
          values.startTime,
        ),

      endTime:
        parseTime(
          values.endTime,
        ),

      venue:
        values.venue || undefined,

      instructions:
        values.instructions ||
        undefined,
    });

  if (!parsed.success) {
    return {
      success: false,
      message:
        parsed.error.issues[0]
          ?.message ??
        "Invalid examination data.",
    };
  }

  try {
    const exam =
      await examService.create(
        parsed.data,
      );

    return {
      success: true,
      message:
        "Examination created successfully.",
      examId: exam.id,
    };
  } catch (error) {
    console.error(
      "Create examination error:",
      error,
    );

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create examination.",
    };
  }
}