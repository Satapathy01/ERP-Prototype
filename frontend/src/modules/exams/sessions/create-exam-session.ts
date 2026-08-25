"use server";

import {
  examSessionSchema,
} from "./exam-session.schema";

import {
  examSessionService,
} from "./exam-session.service";

interface CreateExamSessionValues {
  name: string;
  code?: string;
  academicYear?: string;
  ruleSetId: string;
  startsAt?: string;
  endsAt?: string;
}

export async function createExamSession(
  schoolId: string,
  values: CreateExamSessionValues,
) {
  const parsed =
    examSessionSchema.safeParse({
      schoolId,

      name: values.name,

      code:
        values.code || undefined,

      academicYear:
        values.academicYear || undefined,

      ruleSetId: values.ruleSetId,

      startsAt:
        values.startsAt || undefined,

      endsAt:
        values.endsAt || undefined,
    });

  if (!parsed.success) {
    return {
      success: false,
      message:
        parsed.error.issues[0]?.message ??
        "Invalid examination session data.",
    };
  }

  try {
    const session =
      await examSessionService.create(
        parsed.data,
      );

    return {
      success: true,
      message:
        "Examination session created successfully.",
      sessionId: session.id,
    };
  } catch (error) {
    console.error(
      "Create examination session error:",
      error,
    );

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create examination session.",
    };
  }
}