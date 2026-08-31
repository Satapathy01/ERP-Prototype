import { BatchStatus, BatchShift } from "@prisma/client";
import { z } from "zod";

export const createBatchSchema = z.object({
  courseId: z.string().uuid("Invalid course."),

  teacherId: z.string().uuid("Invalid teacher."),

  name: z
    .string()
    .trim()
    .min(2, "Batch name is required.")
    .max(100),

  shift: z.nativeEnum(BatchShift),

  startTime: z
    .string()
    .min(1, "Start time is required."),

  endTime: z
    .string()
    .min(1, "End time is required."),

  capacity: z
    .number()
    .int()
    .min(1)
    .max(500)
    .default(30),

  status: z
    .nativeEnum(BatchStatus)
    .default(BatchStatus.ACTIVE),
});

export const updateBatchSchema =
  createBatchSchema.partial();

export type CreateBatchInput =
  z.infer<typeof createBatchSchema>;

export type UpdateBatchInput =
  z.infer<typeof updateBatchSchema>;