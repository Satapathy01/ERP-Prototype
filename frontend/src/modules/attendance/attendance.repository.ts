import { prisma } from "@/lib/prisma";

/* -------------------------------------------------------------------------- */
/*                              Types                                         */
/* -------------------------------------------------------------------------- */

interface AttendanceQuery {
  studentId?: string;
  courseId?: string;
  batchId?: string;
  date?: Date;
  from?: Date;
  to?: Date;
  status?: string;
  source?: string;
}

interface AttendanceRecordInput {
  studentId: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
  remarks?: string;
}

interface MarkAttendanceInput {
  courseId?: string;
  batchId?: string;
  date?: Date;
  records: AttendanceRecordInput[];
  source: "MANUAL" | "CLASS";
}

/* -------------------------------------------------------------------------- */
/*                         Attendance Repository                              */
/* -------------------------------------------------------------------------- */

export async function getAttendance(
  schoolId: string,
  query: AttendanceQuery,
) {
  const where: Record<string, unknown> = {
    schoolId,
  };

  if (query.studentId) {
    where.studentId = query.studentId;
  }

  if (query.courseId) {
    where.courseId = query.courseId;
  }

  if (query.batchId) {
    where.batchId = query.batchId;
  }

  if (query.status) {
    where.status = query.status;
  }

  if (query.source) {
    where.source = query.source;
  }

  if (query.date) {
    const start = new Date(query.date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    where.date = {
      gte: start,
      lt: end,
    };
  }

  if (query.from || query.to) {
    where.date = {
      ...(query.from
        ? { gte: query.from }
        : {}),
      ...(query.to
        ? { lte: query.to }
        : {}),
    };
  }

  return prisma.attendanceRecord.findMany({
    where,
    include: {
      student: true,
      course: true,
      batch: true,
      campusEntry: true,
    },
    orderBy: {
      date: "desc",
    },
  });
}

/* -------------------------------------------------------------------------- */
/*                         Student Attendance History                         */
/* -------------------------------------------------------------------------- */

export async function getStudentHistory(
  schoolId: string,
  studentId: string,
) {
  return prisma.attendanceRecord.findMany({
    where: {
      schoolId,
      studentId,
    },
    include: {
      course: true,
      batch: true,
      campusEntry: true,
    },
    orderBy: {
      date: "desc",
    },
  });
}

/* -------------------------------------------------------------------------- */
/*                           Daily Attendance                                 */
/* -------------------------------------------------------------------------- */

export async function getDailyAttendance(
  schoolId: string,
  courseId: string,
  batchId: string,
  date: Date,
) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return prisma.attendanceRecord.findMany({
    where: {
      schoolId,
      courseId,
      batchId,
      date: {
        gte: start,
        lt: end,
      },
    },
    include: {
      student: true,
      course: true,
      batch: true,
    },
    orderBy: {
      student: {
        name: "asc",
      },
    },
  });
}

/* -------------------------------------------------------------------------- */
/*                         Attendance Summary                                 */
/* -------------------------------------------------------------------------- */

export async function getSummary(
  schoolId: string,
  options?: {
    studentId?: string;
    courseId?: string;
    batchId?: string;
    from?: Date;
    to?: Date;
  },
) {
  const where: Record<string, unknown> = {
    schoolId,
  };

  if (options?.studentId) {
    where.studentId = options.studentId;
  }

  if (options?.courseId) {
    where.courseId = options.courseId;
  }

  if (options?.batchId) {
    where.batchId = options.batchId;
  }

  if (options?.from || options?.to) {
    where.date = {
      ...(options.from
        ? { gte: options.from }
        : {}),
      ...(options.to
        ? { lte: options.to }
        : {}),
    };
  }

  const records =
    await prisma.attendanceRecord.findMany({
      where,
      select: {
        status: true,
      },
    });

  const total = records.length;

  const present = records.filter(
    (record) =>
      record.status === "PRESENT",
  ).length;

  const absent = records.filter(
    (record) =>
      record.status === "ABSENT",
  ).length;

  const late = records.filter(
    (record) =>
      record.status === "LATE",
  ).length;

  const excused = records.filter(
    (record) =>
      record.status === "EXCUSED",
  ).length;

  const attendancePercentage =
    total > 0
      ? Number(
          (
            ((present + late) / total) *
            100
          ).toFixed(2),
        )
      : 0;

  return {
    total,
    present,
    absent,
    late,
    excused,
    attendancePercentage,
  };
}

/* -------------------------------------------------------------------------- */
/*                       Mark Manual / Class Attendance                       */
/* -------------------------------------------------------------------------- */

export async function markAttendance(
  schoolId: string,
  markedById: string,
  data: MarkAttendanceInput,
) {
  const date = data.date
    ? new Date(data.date)
    : new Date();

  date.setHours(0, 0, 0, 0);

  return prisma.$transaction(async (tx) => {
    const results = [];

    for (const record of data.records) {
      /*
       * Look for an attendance record for the
       * same student, course, batch and date.
       */
      const existing =
        await tx.attendanceRecord.findFirst({
          where: {
            schoolId,

            studentId:
              record.studentId,

            courseId:
              data.courseId ?? null,

            batchId:
              data.batchId ?? null,

            date,
          },
        });

      if (existing) {
        const updated =
          await tx.attendanceRecord.update({
            where: {
              id: existing.id,
            },

            data: {
              status: record.status,

              remarks:
                record.remarks ?? null,

              markedById,

              source: data.source,
            },
          });

        results.push(updated);
      } else {
        const created =
          await tx.attendanceRecord.create({
            data: {
              schoolId,

              studentId:
                record.studentId,

              courseId:
                data.courseId ?? null,

              batchId:
                data.batchId ?? null,

              date,

              status:
                record.status,

              source:
                data.source,

              remarks:
                record.remarks ?? null,

              markedById,
            },
          });

        results.push(created);
      }
    }

    return results;
  });
}

/* -------------------------------------------------------------------------- */
/*                   Find Student By Registration Number                      */
/* -------------------------------------------------------------------------- */

export async function findStudentByRegistrationNumber(
  schoolId: string,
  registrationNumber: string,
) {
  return prisma.student.findFirst({
    where: {
      schoolId,
      registrationNumber,
    },
  });
}

/* -------------------------------------------------------------------------- */
/*                         Recent Campus Entry                                */
/* -------------------------------------------------------------------------- */

export async function findRecentCampusEntry(
  schoolId: string,
  studentId: string,
) {
  /*
   * Prevent repeated scans from generating
   * multiple campus entries within 2 minutes.
   */

  const since = new Date(
    Date.now() - 2 * 60 * 1000,
  );

  return prisma.campusEntry.findFirst({
    where: {
      schoolId,
      studentId,

      scannedAt: {
        gte: since,
      },
    },

    orderBy: {
      scannedAt: "desc",
    },
  });
}

/* -------------------------------------------------------------------------- */
/*                           Create Campus Entry                              */
/* -------------------------------------------------------------------------- */

export async function createCampusEntry(data: {
  schoolId: string;
  studentId: string;
  registrationNumber: string;
  deviceId?: string | null;
  gateName?: string | null;
}) {
  return prisma.campusEntry.create({
    data: {
      schoolId:
        data.schoolId,

      studentId:
        data.studentId,

      registrationNumber:
        data.registrationNumber,

      deviceId:
        data.deviceId ?? null,

      gateName:
        data.gateName ?? null,
    },

    include: {
      student: true,
    },
  });
}

/* -------------------------------------------------------------------------- */
/*                          Campus Entry History                              */
/* -------------------------------------------------------------------------- */

export async function getCampusHistory(
  schoolId: string,
  options?: {
    studentId?: string;
    from?: Date;
    to?: Date;
    limit?: number;
  },
) {
  const where: Record<string, unknown> = {
    schoolId,
  };

  if (options?.studentId) {
    where.studentId =
      options.studentId;
  }

  if (options?.from || options?.to) {
    where.scannedAt = {
      ...(options.from
        ? { gte: options.from }
        : {}),

      ...(options.to
        ? { lte: options.to }
        : {}),
    };
  }

  return prisma.campusEntry.findMany({
    where,

    include: {
      student: true,
    },

    orderBy: {
      scannedAt: "desc",
    },

    take: options?.limit ?? 100,
  });
}