import { useMemo } from "react";

type Payment = {
  amountPaid: number | string;
  receiptDate?: Date | string | null;
  createdAt: Date | string;
  status: string;
};

export function useFinanceSummary(
  payments: Payment[],
) {
  return useMemo(() => {
    const totalCollection = payments.reduce(
      (sum, payment) => sum + Number(payment.amountPaid),
      0,
    );

    const today = new Date().toDateString();

    const todayCollection = payments
      .filter(
        (payment) =>
          new Date(
            payment.receiptDate ??
              payment.createdAt,
          ).toDateString() === today,
      )
      .reduce(
        (sum, payment) =>
          sum + Number(payment.amountPaid),
        0,
      );

    const now = new Date();

    const monthlyCollection = payments
      .filter((payment) => {
        const date = new Date(
          payment.receiptDate ??
            payment.createdAt,
        );

        return (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() ===
            now.getFullYear()
        );
      })
      .reduce(
        (sum, payment) =>
          sum + Number(payment.amountPaid),
        0,
      );

    const pendingAmount = payments
      .filter(
        (payment) =>
          payment.status === "PENDING",
      )
      .reduce(
        (sum, payment) =>
          sum + Number(payment.amountPaid),
        0,
      );

    return {
      totalCollection,
      todayCollection,
      monthlyCollection,
      pendingAmount,
    };
  }, [payments]);
}