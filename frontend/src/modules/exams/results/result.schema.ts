import { z } from "zod";

export const examResultSchema = z.object({
  registrationId: z
    .string()
    .min(1, "Exam registration is required."),

  marksObtained: z
    .coerce
    .number()
    .min(0, "Marks cannot be negative."),

  grade: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

  gradePoint: z
    .coerce
    .number()
    .min(0)
    .optional(),

  remarks: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
});

export type ExamResultInput = z.infer<
  typeof examResultSchema
>;