import { Prisma } from "@prisma/client";

export interface BatchFilters {
  search?: string;

  teacherId?: string;

  courseId?: string;

  isActive?: boolean;

  page?: number;

  limit?: number;
}

export type BatchListItem =
  Prisma.BatchGetPayload<{
    include: {
      teacher: true;
      course: true;
      _count: {
        select: {
          admissions: true;
        };
      };
    };
  }>;

export interface BatchListResult {
  batches: BatchListItem[];

  total: number;

  page: number;

  limit: number;

  totalPages: number;
}

export type BatchDetails =
  Prisma.BatchGetPayload<{
    include: {
      teacher: true;
      course: true;
      admissions: {
        include: {
          student: true;
        };
      };
    };
  }>;