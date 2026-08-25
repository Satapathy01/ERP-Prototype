import { z } from "zod";

export const eligibilityEvaluationSchema =
  z.object({
    studentId: z
      .string()
      .min(1, "Student is required."),

    sessionId: z
      .string()
      .min(1, "Exam session is required."),

    admissionId: z
      .string()
      .optional()
      .or(z.literal("")),
  });

export type EligibilityEvaluationInput =
  z.infer<
    typeof eligibilityEvaluationSchema
  >;