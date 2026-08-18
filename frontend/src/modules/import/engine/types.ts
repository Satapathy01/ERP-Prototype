import { ImportField } from "@prisma/client";
import { Prisma } from "@prisma/client";

export { ImportField };

export type MatchStrategy =
  | "exact"
  | "normalized"
  | "fuzzy"
  | "ai"
  | "manual"
  | "unknown";

export interface HeaderMatch {
  original: string;

  normalized: string;

  field: ImportField;

  confidence: number;

  strategy: MatchStrategy;

  matchedAlias?: string;
}
export interface MappedImportRow {
  student: {
    registrationNumber?: string;
    name?: string;
    fatherName?: string;
    motherName?: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    pinCode?: string;
    aadhaarNumber?: string;
    gender?: string;
    dateOfBirth?: Date;
  };

  admission: {
    course?: string;
    admissionDate?: Date;
  };

  payment: {
    mrNumber?: string;
    receiptDate?: Date;
    amountPaid?: number;
  };
}

export interface ValidationIssue {
  field: string;
  code: string;
  message: string;
  value?: unknown;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
}
export interface ImportPreviewRow {
  rowNumber: number;

  raw: Prisma.InputJsonObject;

  mapped: MappedImportRow;

  validation: ValidationResult;
}

export interface ImportPreview {
  headers: HeaderMatch[];

  rows: ImportPreviewRow[];

  totalRows: number;

  validRows: number;

  invalidRows: number;
}