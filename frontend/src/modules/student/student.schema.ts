import { z } from "zod";

import { Gender, StudentStatus } from "@prisma/client";

export const createStudentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Student Name is required")
    .max(100, "Student Name is too long"),

  fatherName: z
    .string()
    .trim()
    .max(100, "Father Name is too long")
    .optional(),

  motherName: z
    .string()
    .trim()
    .max(100, "Mother Name is too long")
    .optional(),

  gender: z
    .nativeEnum(Gender)
    .optional(),

  dateOfBirth: z
    .string()
    .optional(),

  bloodGroup: z
    .string()
    .trim()
    .max(20)
    .optional(),

  studentPhone: z
    .string()
    .trim()
    .max(20)
    .optional(),

  parentPhone: z
    .string()
    .trim()
    .max(20)
    .optional(),

  email: z
    .string()
    .trim()
    .email("Invalid email")
    .optional()
    .or(z.literal("")),

  address: z
    .string()
    .trim()
    .max(500)
    .optional(),

  city: z
    .string()
    .trim()
    .max(100)
    .optional(),

  state: z
    .string()
    .trim()
    .max(100)
    .optional(),

  pinCode: z
    .string()
    .trim()
    .max(10)
    .optional(),

  aadhaarNumber: z
    .string()
    .trim()
    .max(20)
    .optional(),

  photoUrl: z
    .string()
    .trim()
    .optional(),

  status: z
    .nativeEnum(StudentStatus),
  
  courseId: z
    .string()
    .uuid("Please select a valid course")
    .optional(),
});

export type CreateStudentInput = z.infer<
  typeof createStudentSchema
>;