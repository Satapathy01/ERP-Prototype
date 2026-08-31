import { prisma } from "@/lib/prisma";

export async function getAcademicReport(
  schoolId: string,
) {
  const [
    studentCount,
    courseCount,
    attendanceRecords,
    examResults,
  ] = await Promise.all([
    prisma.student.count({
      where: {
        schoolId,
        status: "ACTIVE",
      },
    }),

    prisma.course.count({
      where: {
        schoolId,
        isActive: true,
      },
    }),

    prisma.attendanceRecord.findMany({
      where: {
        schoolId,
      },
      select: {
        status: true,
      },
    }),

    prisma.examResult.findMany({
      where: {
        status: {
          in: ["PASS", "FAIL"],
        },
        registration: {
          exam: {
            session: {
              schoolId,
            },
          },
        },
      },
      select: {
        status: true,
        percentage: true,
      },
    }),
  ]);

  const attendanceTotal =
    attendanceRecords.length;

  const attendancePresent =
    attendanceRecords.filter(
      (record) => record.status === "PRESENT",
    ).length;

  const attendancePercentage =
    attendanceTotal > 0
      ? (attendancePresent / attendanceTotal) * 100
      : 0;

  const resultTotal =
    examResults.length;

  const passedResults =
    examResults.filter(
      (result) => result.status === "PASS",
    ).length;

  const passRate =
    resultTotal > 0
      ? (passedResults / resultTotal) * 100
      : 0;

  return {
    students: studentCount,
    courses: courseCount,
    attendance: Number(
      attendancePercentage.toFixed(2),
    ),
    passRate: Number(
      passRate.toFixed(2),
    ),
  };
}
