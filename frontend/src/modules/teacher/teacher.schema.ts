import { TeacherStatus, TeacherType } from "@prisma/client";
import { z } from "zod";

export const createTeacherSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Teacher name must be at least 2 characters.")
    .max(100, "Teacher name cannot exceed 100 characters."),

  phone: z
    .string()
    .trim()
    .max(15, "Phone number cannot exceed 15 characters.")
    .optional()
    .or(z.literal("")),

  email: z
    .string()
    .trim()
    .email("Invalid email address.")
    .optional()
    .or(z.literal("")),

  qualification: z
    .string()
    .trim()
    .max(150, "Qualification cannot exceed 150 characters.")
    .optional()
    .or(z.literal("")),

  specialization: z
    .string()
    .trim()
    .max(150, "Specialization cannot exceed 150 characters.")
    .optional()
    .or(z.literal("")),

  joiningDate: z.coerce
    .date()
    .optional(),

  photoUrl: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

  status: z
    .nativeEnum(TeacherStatus)
    .default(TeacherStatus.ACTIVE),

  type: z
    .nativeEnum(TeacherType)
    .default(TeacherType.FULL_TIME),
});

export const updateTeacherSchema = createTeacherSchema.partial();

export type CreateTeacherInput = z.infer<typeof createTeacherSchema>;

export type UpdateTeacherInput = z.infer<typeof updateTeacherSchema>;