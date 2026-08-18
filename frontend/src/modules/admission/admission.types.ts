import { Prisma } from "@prisma/client";

export interface AdmissionFilters {
  search?: string;
  studentId?: string;
  courseId?: string;
  session?: string;
  batchName?: string;
  trainerName?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export type AdmissionListItem =
  Prisma.AdmissionGetPayload<{
    include: {
      student: true;
      course: true;
    };
  }>;

export interface AdmissionListResult {
  admissions: AdmissionListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type AdmissionWithRelations =
  Prisma.AdmissionGetPayload<{
    include: {
      student: true;
      course: true;
      feeLedger: true;
      feePayments: true;
    };
  }>;

export type AdmissionDetails =
  Prisma.AdmissionGetPayload<{
    include: {
      school: true;
      student: true;
      course: true;
      feeLedger: {
        orderBy: {
          installmentNumber: "asc";
        };
      };
      feePayments: {
        orderBy: {
          receiptDate: "desc";
        };
      };
    };
  }>;

export type AdmissionSelect =
  Prisma.AdmissionSelect;

export type AdmissionWhereInput =
  Prisma.AdmissionWhereInput;

export type AdmissionOrderByInput =
  Prisma.AdmissionOrderByWithRelationInput;