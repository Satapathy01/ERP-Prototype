import { z } from "zod";

export const examRegistrationSchema = z.object({
  sessionId: z
    .string()
    .min(1, "Exam session is required."),

  examId: z
    .string()
    .min(1, "Exam is required."),

  studentId: z
    .string()
    .min(1, "Student is required."),

  admissionId: z
    .string()
    .optional()
    .or(z.literal("")),
});

export type ExamRegistrationInput = z.infer<
  typeof examRegistrationSchema
>;