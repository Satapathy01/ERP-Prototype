import { z } from "zod";

export const courseSchema = z.object({
  code: z
    .string()
    .trim()
    .min(2, "Course code must be at least 2 characters")
    .max(20, "Course code cannot exceed 20 characters")
    .transform((value) => value.toUpperCase()),

  name: z
    .string()
    .trim()
    .min(3, "Course name must be at least 3 characters")
    .max(100, "Course name cannot exceed 100 characters"),

  durationMonths: z.coerce
    .number()
    .int()
    .positive("Duration must be greater than 0"),

  admissionFee: z.coerce
    .number()
    .min(0, "Admission fee cannot be negative"),

  monthlyFee: z.coerce
    .number()
    .min(0, "Monthly fee cannot be negative"),

  certificateFee: z.coerce
    .number()
    .positive("Certificate fee must be greater than 0")
    .default(500),

  installmentCount: z.coerce
    .number()
    .int()
    .positive("Installment count must be greater than 0"),

  discount: z.coerce
    .number()
    .min(0, "Discount cannot be negative")
    .default(0),

  totalFee: z.coerce
    .number()
    .min(0, "Total fee cannot be negative"),

  isActive: z.boolean().default(true),
});

export type CourseSchema =
  z.input<typeof courseSchema>;

export type CourseData =
  z.output<typeof courseSchema>;