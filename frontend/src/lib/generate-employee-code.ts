import { Prisma } from "@prisma/client";

export async function generateEmployeeCode(
  tx: Prisma.TransactionClient,
  schoolId: string
): Promise<string> {
  const year = new Date().getFullYear().toString().slice(-2);

  const lastTeacher = await tx.teacher.findFirst({
    where: {
      schoolId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      employeeCode: true,
    },
  });

  let next = 1;

  if (lastTeacher?.employeeCode) {
    const match = lastTeacher.employeeCode.match(/(\d{6})$/);

    if (match) {
      next = Number(match[1]) + 1;
    }
  }

  return `EMP${year}${String(next).padStart(6, "0")}`;
}