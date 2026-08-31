import { prisma } from "~/lib/prisma";

import type {
  CreateBatchInput,
  UpdateBatchInput,
} from "./batch.schema";

interface GetBatchesOptions {
  schoolId: string;

  page?: number;
  pageSize?: number;

  search?: string;

  teacherId?: string;
  courseId?: string;

  isActive?: boolean;
}
export async function getBatches({
  schoolId,
  page = 1,
  pageSize = 20,
  search = "",
  teacherId,
  courseId,
  isActive,
}: GetBatchesOptions) {
  const where = {
    schoolId,

    ...(teacherId
      ? {
          teacherId,
        }
      : {}),

    ...(courseId
      ? {
          courseId,
        }
      : {}),

    ...(typeof isActive === "boolean"
      ? {
          isActive,
        }
      : {}),

    ...(search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              teacher: {
                name: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            },
            {
              course: {
                name: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            },
          ],
        }
      : {}),
  };

  const total = await prisma.batch.count({
    where,
  });

  const batches = await prisma.batch.findMany({
    where,

    include: {
      teacher: true,
      course: true,

      _count: {
        select: {
          admissions: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },

    skip: (page - 1) * pageSize,

    take: pageSize,
  });

  const data = batches.map((batch) => ({
    ...batch,

    currentStrength: batch._count.admissions,

    availableSeats:
      batch.capacity - batch._count.admissions,

    isFull:
      batch._count.admissions >= batch.capacity,
  }));

  return {
    batches: data,

    total,

    currentPage: page,

    pageSize,

    totalPages: Math.ceil(total / pageSize),
  };
}
export async function getBatchById(id: string) {
  return prisma.batch.findUnique({
    where: {
      id,
    },

    include: {
      teacher: true,

      course: true,

      admissions: {
        include: {
          student: true,
        },
      },

      _count: {
        select: {
          admissions: true,
        },
      },
    },
  });
}
export async function createBatch(
  schoolId: string,
  data: CreateBatchInput
) {
  return prisma.$transaction(
    async (tx) => {
    const teacher = await tx.teacher.findFirst({
  where: {
    id: data.teacherId,
    schoolId,
  },
});

    if (!teacher) {
      throw new Error("Teacher not found.");
    }

    const course = await tx.course.findFirst({
      where: {
        id: data.courseId,
        schoolId,
        isActive: true,
      },
    });

    if (!course) {
      throw new Error("Course not found.");
    }

    const duplicate = await tx.batch.findFirst({
      where: {
        schoolId,
        teacherId: data.teacherId,
        shift: data.shift,
        startTime: data.startTime,
        endTime: data.endTime,
        isActive: true,
      },
    });

    if (duplicate) {
      throw new Error(
        "Teacher already has a batch during this time."
      );
    }

    return tx.batch.create({
      data: {
        schoolId,
        teacherId: data.teacherId,
        courseId: data.courseId,
        name: data.name,
        shift: data.shift,
        startTime: data.startTime,
        endTime: data.endTime,
        capacity: data.capacity,
        status: data.status,
      },
      include: {
        teacher: true,
        course: true,
      },
    });
  });
}
export async function updateBatch(
  id: string,
  schoolId: string,
  data: UpdateBatchInput
) {
  return prisma.$transaction(async (tx) => {
    const batch = await tx.batch.findFirst({
      where: {
        id,
        schoolId,
      },
    });

    if (!batch) {
      throw new Error("Batch not found.");
    }

    if (data.teacherId) {
      const teacher = await tx.teacher.findFirst({
  where: {
    id: data.teacherId,
    schoolId,
  },
});
      if (!teacher) {
        throw new Error("Teacher not found.");
      }
    }

    if (data.courseId) {
      const course = await tx.course.findFirst({
        where: {
          id: data.courseId,
          schoolId,
          isActive: true,
        },
      });

      if (!course) {
        throw new Error("Course not found.");
      }
    }

    const teacherId = data.teacherId ?? batch.teacherId;
    const shift = data.shift ?? batch.shift;
    const startTime = data.startTime ?? batch.startTime;
    const endTime = data.endTime ?? batch.endTime;

    const duplicate = await tx.batch.findFirst({
      where: {
        id: {
          not: id,
        },
        schoolId,
        teacherId,
        shift,
        startTime,
        endTime,
        isActive: true,
      },
    });

    if (duplicate) {
      throw new Error(
        "Teacher already has another batch during this time."
      );
    }

     return tx.batch.update({
      where: {
        id,
      },
      data: {
        teacherId: data.teacherId,
        courseId: data.courseId,
        name: data.name,
        shift: data.shift,
        startTime: data.startTime,
        endTime: data.endTime,
        capacity: data.capacity,
        status: data.status,
      },
      include: {
        teacher: true,
        course: true,
      },
    });
  },
  {
    maxWait: 10000,
    timeout: 20000,
  } );
}
export async function deleteBatch(id: string) {
  return prisma.$transaction(async (tx) => {
    const batch = await tx.batch.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            admissions: true,
          },
        },
      },
    });

    if (!batch) {
      throw new Error("Batch not found.");
    }

    if (batch._count.admissions > 0) {
      throw new Error(
        "Cannot delete a batch that has admitted students."
      );
    }

    return tx.batch.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });
  });
}
export async function restoreBatch(id: string) {
  return prisma.batch.update({
    where: {
      id,
    },
    data: {
      isActive: true,
    },
  });
}
