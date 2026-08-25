import { z } from "zod";

export const createCertificateSchema = z.object({
  studentId: z
    .string()
    .min(1, "Student is required."),

  admissionId: z
    .string()
    .optional()
    .or(z.literal("")),

  sessionId: z
    .string()
    .min(
      1,
      "Examination session is required.",
    ),

  certificateNumber: z
    .string()
    .trim()
    .min(
      1,
      "Certificate number is required.",
    ),

  certificateType: z
    .string()
    .trim()
    .min(1)
    .default("COURSE_COMPLETION"),

  certificateFee: z
    .coerce
    .number()
    .positive()
    .default(500),
});

export type CreateCertificateInput =
  z.infer<typeof createCertificateSchema>;

/*
 * Certificate lifecycle must match
 * the Prisma CertificateStatus enum.
 */
export const certificateStatusSchema =
  z.object({
    status: z.enum([
      "NOT_CREATED",
      "CREATED",
      "READY_FOR_COLLECTION",
      "ISSUED",
      "CANCELLED",
    ]),
  });

export type CertificateStatusInput =
  z.infer<
    typeof certificateStatusSchema
  >;