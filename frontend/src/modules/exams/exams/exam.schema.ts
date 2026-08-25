import { z } from "zod";

export const examSchema = z.object({
  sessionId: z
    .string()
    .min(1, "Exam session is required."),

  courseId: z
    .string()
    .min(1, "Course is required."),

  name: z
    .string()
    .trim()
    .min(2, "Exam name is required."),

  code: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

  type: z.enum([
    "THEORY",
    "PRACTICAL",
  ]),

  maxMarks: z
    .coerce
    .number()
    .positive("Maximum marks must be greater than 0."),

  passMarks: z
    .coerce
    .number()
    .min(0, "Pass marks cannot be negative."),

  examDate: z.coerce.date().optional(),

  startTime: z.coerce.date().optional(),

  endTime: z.coerce.date().optional(),

  venue: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

  instructions: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
}).superRefine((data, ctx) => {
  if (data.passMarks > data.maxMarks) {
    ctx.addIssue({
      code: "custom",
      path: ["passMarks"],
      message:
        "Pass marks cannot be greater than maximum marks.",
    });
  }

  if (
    data.startTime &&
    data.endTime &&
    data.endTime < data.startTime
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["endTime"],
      message:
        "End time cannot be before start time.",
    });
  }
});

export type ExamInput = z.infer<typeof examSchema>;