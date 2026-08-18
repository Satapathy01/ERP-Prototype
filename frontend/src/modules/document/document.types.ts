// src/modules/document/document.types.ts

import { DocumentType } from "@prisma/client";

export interface UploadDocumentInput {
  schoolId: string;

  studentId?: string;

  admissionId?: string;

  feePaymentId?: string;

  uploadedBy?: string;

  title: string;

  type: DocumentType;

  /**
   * Relative folder inside STORAGE_ROOT
   * Example:
   * students/STU00001/photos
   * students/STU00001/identity
   * admissions/ADM001
   * receipts/PAY001
   */
  folder: string;

  file: File;
}

export interface ReplaceDocumentInput {
  documentId: string;

  uploadedBy?: string;

  folder: string;

  file: File;

  title?: string;
}

export interface DeleteDocumentInput {
  documentId: string;
}

export interface ListDocumentsInput {
  schoolId: string;

  studentId?: string;

  admissionId?: string;

  feePaymentId?: string;

  type?: DocumentType;
}

export interface DocumentDownload {
  buffer: Buffer;
  mimeType: string;
  filename: string;
}