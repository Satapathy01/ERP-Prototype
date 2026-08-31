import { z } from "zod";

export const createAdmissionSchema = z.object({
    studentId: z
    .string()
    .uuid("Invalid student ID"),

  schoolId: z
    .string()
    .uuid("Invalid school ID"),

  courseId: z
    .string()
    .uuid("Invalid course ID"),

  batchId: z
    .string()
    .uuid("Invalid batch ID")
    .nullable()
    .optional(),

  admissionDate: z.coerce.date(),

  session: z
    .string()
    .trim()
    .max(100)
    .optional()
    .or(z.literal("")),

  remarks: z
    .string()
    .trim()
    .max(500)
    .optional()
    .or(z.literal("")),

  expectedCompletionDate: z
    .coerce
    .date()
    .optional(),

  admissionFee: z
    .coerce
    .number()
    .min(0, "Admission fee cannot be negative"),

  monthlyFee: z
    .coerce
    .number()
    .min(0, "Monthly fee cannot be negative"),

  certificateFee: z
    .coerce
    .number()
    .min(0, "Certificate fee cannot be negative"),

  totalFee: z
    .coerce
    .number()
    .min(0, "Total fee cannot be negative"),

  discount: z
    .coerce
    .number()
    .min(0)
    .default(0),

  admissionFeePaid: z
    .boolean()
    .default(false),

  paymentMode: z.enum([
    "CASH",
    "UPI",
    "CARD",
    "BANK_TRANSFER",
    "CHEQUE",
  ]).default("CASH"),

  isActive: z
    .boolean()
    .default(true),
});

export const updateAdmissionSchema =
  createAdmissionSchema.partial();

export type CreateAdmissionInput =
  z.infer<typeof createAdmissionSchema>;

export type UpdateAdmissionInput =
  z.infer<typeof updateAdmissionSchema>;