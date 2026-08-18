import { prisma } from "~/lib/prisma";

import { buildFinanceWhere } from "../finance.helper";

import type {
  CreateFeePaymentInput,
  FinanceQuery,
  UpdateFeePaymentInput,
} from "../finance.schema";

/* -------------------------------------------------------------------------- */
/*                               Query Payments                               */
/* -------------------------------------------------------------------------- */

export async function getFeePayments(
  schoolId: string,
  query: FinanceQuery,
) {
  return prisma.feePayment.findMany({
    where: buildFinanceWhere(schoolId, query),

    include: {
      admission: {
        include: {
          student: true,
          course: true,
        },
      },

      paymentItems: {
        include: {
          feeSchedule: true,
        },
      },
    },

    orderBy: {
      receiptDate: "desc",
    },

    skip: (query.page - 1) * query.limit,

    take: query.limit,
  });
}

/* -------------------------------------------------------------------------- */
/*                       Admission Payment Context                            */
/* -------------------------------------------------------------------------- */

export async function getAdmissionPaymentContext(
  schoolId: string,
  admissionId: string,
) {
  return prisma.admission.findFirst({
    where: {
      id: admissionId,
      schoolId,
    },

    include: {
      student: {
        select: {
          id: true,
          name: true,
          registrationNumber: true,
          photoUrl: true,
        },
      },

      course: {
        include: {
          feeSchedules: {
            where: {
              isActive: true,
            },
            orderBy: {
              dueOrder: "asc",
            },
          },
        },
      },

      batch: {
        select: {
          id: true,
          name: true,
        },
      },

      // IMPORTANT
      feeLedger: {
        orderBy: {
          installmentNumber: "asc",
        },
      },

      feePayments: {
        include: {
          paymentItems: {
            include: {
              feeSchedule: true,
            },
          },
        },

        orderBy: {
          receiptDate: "desc",
        },
      },
    },
  });
}
/* -------------------------------------------------------------------------- */
/*                            Create Fee Payment                              */
/* -------------------------------------------------------------------------- */

export async function createFeePayment(
  data: CreateFeePaymentInput,
) {
  return prisma.$transaction(async (tx) => {
    /*
     * --------------------------------------------------
     * 1. Create the payment
     * --------------------------------------------------
     */

    const payment = await tx.feePayment.create({
      data: {
        admission: {
          connect: {
            id: data.admissionId,
          },
        },

        receiptNumber: data.receiptNumber,
        mrNumber: data.mrNumber,
        receiptDate: data.receiptDate,
        amountPaid: data.amountPaid,
        status: data.status,
        paymentMethod: data.paymentMethod,
        transactionId: data.transactionId,
        remarks: data.remarks,
        collectedBy: data.collectedBy,

        paymentItems: {
          create: data.paymentItems.map((item) => ({
            feeSchedule: {
              connect: {
                id: item.feeScheduleId,
              },
            },

            title: item.title,
            amount: item.amount,
          })),
        },
      },

      include: {
        admission: {
          include: {
            student: true,
            course: true,
          },
        },

        paymentItems: {
          include: {
            feeSchedule: true,
          },
        },
      },
    });

    /*
     * --------------------------------------------------
     * 2. Update FeeLedger
     * --------------------------------------------------
     *
     * Match using BOTH:
     *
     *   admissionId
     *   feeScheduleId
     *   title
     *
     * This allows:
     *
     *   Month 1
     *   Month 2
     *   Month 3
     *
     * to use the same monthly FeeSchedule while
     * remaining separate ledger entries.
     * --------------------------------------------------
     */

    for (const item of data.paymentItems) {
      const ledger = await tx.feeLedger.findFirst({
        where: {
          admissionId: data.admissionId,
          feeScheduleId: item.feeScheduleId,
          title: item.title,
        },
      });

      if (!ledger) {
        throw new Error(
          `Fee ledger entry not found for "${item.title}".`,
        );
      }

      const currentPaid = Number(
        ledger.paidAmount ?? 0,
      );

      const ledgerAmount = Number(
        ledger.amount ?? 0,
      );

      const paymentAmount = Number(
        item.amount,
      );

      const newPaidAmount =
        currentPaid + paymentAmount;

      const newDueAmount = Math.max(
        ledgerAmount - newPaidAmount,
        0,
      );

      await tx.feeLedger.update({
        where: {
          id: ledger.id,
        },

        data: {
          paidAmount: newPaidAmount,
          dueAmount: newDueAmount,
        },
      });
    }

    /*
     * --------------------------------------------------
     * 3. Return the newly-created payment
     * --------------------------------------------------
     */

    return payment;
  });
}

/* -------------------------------------------------------------------------- */
/*                            Update Fee Payment                              */
/* -------------------------------------------------------------------------- */

export async function updateFeePayment(
  id: string,
  schoolId: string,
  data: UpdateFeePaymentInput,
) {
  const payment = await prisma.feePayment.findFirst({
    where: {
      id,
      admission: {
        schoolId,
      },
    },
  });

  if (!payment) {
    throw new Error("Payment not found.");
  }

  return prisma.feePayment.update({
    where: {
      id,
    },

    data: {
      receiptNumber: data.receiptNumber,
      mrNumber: data.mrNumber,
      receiptDate: data.receiptDate,
      amountPaid: data.amountPaid,
      status: data.status,
      paymentMethod: data.paymentMethod,
      transactionId: data.transactionId,
      remarks: data.remarks,
      collectedBy: data.collectedBy,
    },

    include: {
      paymentItems: {
        include: {
          feeSchedule: true,
        },
      },
    },
  });
}

/* -------------------------------------------------------------------------- */
/*                            Delete Fee Payment                              */
/* -------------------------------------------------------------------------- */

export async function deleteFeePayment(
  id: string,
  schoolId: string,
) {
  const payment = await prisma.feePayment.findFirst({
    where: {
      id,
      admission: {
        schoolId,
      },
    },
  });

  if (!payment) {
    throw new Error("Payment not found.");
  }

  return prisma.feePayment.delete({
    where: {
      id,
    },
  });
}

/* -------------------------------------------------------------------------- */
/*                            Get Payment By Id                               */
/* -------------------------------------------------------------------------- */

export async function getPaymentById(
  schoolId: string,
  id: string,
) {
  return prisma.feePayment.findFirst({
    where: {
      id,
      admission: {
        schoolId,
      },
    },

    include: {
      admission: {
        include: {
          student: true,
          course: true,
        },
      },

      paymentItems: {
        include: {
          feeSchedule: true,
        },
      },
    },
  });
}
/* -------------------------------------------------------------------------- */
/*                         Admission Payment History                          */
/* -------------------------------------------------------------------------- */

export async function getPaymentHistory(
  schoolId: string,
  admissionId: string,
) {
  return prisma.feePayment.findMany({
    where: {
      admissionId,

      admission: {
        schoolId,
      },
    },

    include: {
      paymentItems: {
        include: {
          feeSchedule: true,
        },
      },

      admission: {
        include: {
          student: true,
          course: true,
        },
      },
    },

    orderBy: {
      receiptDate: "desc",
    },
  });
}
/* -------------------------------------------------------------------------- */
/*                              Payment Receipt                               */
/* -------------------------------------------------------------------------- */

export async function getPaymentReceipt(
  schoolId: string,
  paymentId: string,
) {
  return prisma.feePayment.findFirst({
    where: {
      id: paymentId,
      admission: {
        schoolId,
      },
    },

    include: {
      admission: {
        include: {
          student: true,
          course: true,
          batch: true,
        },
      },

      paymentItems: {
        include: {
          feeSchedule: true,
        },
      },
    },
  });
}