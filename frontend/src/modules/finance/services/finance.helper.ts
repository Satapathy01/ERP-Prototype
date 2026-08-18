import { Prisma } from "@prisma/client";
import type { FinanceQuery } from "./finance.schema";

export function buildFinanceWhere(
  schoolId: string,
  query: FinanceQuery,
): Prisma.FeePaymentWhereInput {
  const where: Prisma.FeePaymentWhereInput = {
    admission: {
      schoolId,
    },
  };

  if (query.search) {
    where.OR = [
      {
        receiptNumber: {
          contains: query.search,
          mode: "insensitive",
        },
      },
      {
        mrNumber: {
          contains: query.search,
          mode: "insensitive",
        },
      },
      {
        admission: {
          student: {
            name: {
              contains: query.search,
              mode: "insensitive",
            },
          },
        },
      },
      {
        admission: {
          student: {
            registrationNumber: {
              contains: query.search,
              mode: "insensitive",
            },
          },
        },
      },
    ];
  }

  if (query.status) {
    where.status = query.status;
  }

  if (query.paymentMethod) {
    where.paymentMethod = query.paymentMethod;
  }

  if (query.from || query.to) {
    where.receiptDate = {};

    if (query.from) {
      where.receiptDate.gte = new Date(query.from);
    }

    if (query.to) {
      where.receiptDate.lte = new Date(query.to);
    }
  }

  return where;
}