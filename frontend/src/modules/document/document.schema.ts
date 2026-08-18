import { z } from "zod";
import { DocumentType } from "@prisma/client";

export const uploadDocumentSchema = z.object({
  schoolId: z.string().cuid(),

  studentId: z.string().cuid().optional(),

  admissionId: z.string().cuid().optional(),

  feePaymentId: z.string().cuid().optional(),

  uploadedBy: z.string().optional(),

  title: z.string().min(1),

  type: z.nativeEnum(DocumentType),

  folder: z.string().min(1),
});

export const replaceDocumentSchema = z.object({
  documentId: z.string().cuid(),

  uploadedBy: z.string().optional(),

  title: z.string().optional(),

  folder: z.string().min(1),
});

export const deleteDocumentSchema = z.object({
  documentId: z.string().cuid(),
});