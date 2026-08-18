import { Prisma } from "@prisma/client";

export interface TeacherFilters {
  search?: string;
  isActive?: boolean;
  status?: string;

  page?: number;
  limit?: number;
}

export type TeacherListItem = Prisma.TeacherGetPayload<{
  include: {
    batches: {
      select: {
        id: true;
        name: true;
        startTime: true;
        endTime: true;
        capacity: true;
      };
    };
  };
}>;

export interface TeacherListResult {
  teachers: TeacherListItem[];

  total: number;

  page: number;

  limit: number;

  totalPages: number;
}

export type TeacherDetails = Prisma.TeacherGetPayload<{
  include: {
    batches: {
      include: {
        course: true;
      };
    };

    school: {
      select: {
        id: true;
        name: true;
      };
    };
  };
}>;