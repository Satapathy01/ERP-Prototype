import { z } from "zod";

export const examSessionSchema = z.object({
  schoolId: z.string().min(1),

  name: z
    .string()
    .trim()
    .min(2, "Session name is required."),

  code: z
    .string()
    .trim()
    .min(1)
    .optional()
    .or(z.literal("")),

  academicYear: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

  ruleSetId: z
    .string()
    .min(1, "Examination rule set is required."),

  startsAt: z.coerce.date().optional(),

  endsAt: z.coerce.date().optional(),
});

export type ExamSessionInput = z.infer<
  typeof examSessionSchema
>;