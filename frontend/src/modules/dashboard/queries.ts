import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const [
    studentCount,
    userCount,
    paymentAggregate,
    importJobCount,
  ] = await Promise.all([
    prisma.student.count(),
    prisma.user.count(),
    prisma.feePayment.aggregate({
      _sum: {
        amountPaid: true,
      },
    }),
    prisma.importJob.count(),
  ]);

  return {
    students: studentCount,
    staff: userCount,
    imports: importJobCount,
    revenue: Number(paymentAggregate._sum.amountPaid ?? 0),
  };
}