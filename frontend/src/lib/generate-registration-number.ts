import { Prisma } from "@prisma/client";

export async function generateRegistrationNumber(
  tx: Prisma.TransactionClient,
  schoolId: string
): Promise<string> {
  const year = new Date().getFullYear().toString().slice(-2);

  const lastStudent = await tx.student.findFirst({
    where: {
      schoolId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      registrationNumber: true,
    },
  });

  let next = 1;

  if (lastStudent?.registrationNumber) {
    const match = lastStudent.registrationNumber.match(/(\d{6})$/);

    if (match) {
      next = Number(match[1]) + 1;
    }
  }

  return `CICA${year}${String(next).padStart(6, "0")}`;
}