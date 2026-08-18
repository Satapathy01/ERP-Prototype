import * as financeRepository from "./repository/finance.repository";

import type {
  CreateFeePaymentInput,
  UpdateFeePaymentInput,
  FinanceQuery,
} from "./finance.schema";

/* -------------------------------------------------------------------------- */
/*                              Get Payments                                  */
/* -------------------------------------------------------------------------- */

export async function getFeePayments(
  schoolId: string,
  query: FinanceQuery,
) {
  return financeRepository.getFeePayments(schoolId, query);
}

/* -------------------------------------------------------------------------- */
/*                              Create Payment                                */
/* -------------------------------------------------------------------------- */

export async function createPayment(
  schoolId: string,
  data: CreateFeePaymentInput,
) {
  const admission =
    await financeRepository.getAdmissionPaymentContext(
      schoolId,
      data.admissionId,
    );

  if (!admission) {
    throw new Error("Admission not found.");
  }

  // Fee schedules belong to the course
  const selectedSchedules =
    admission.course.feeSchedules.filter(
      (schedule) =>
        data.paymentItems.some(
          (item) =>
            item.feeScheduleId ===
            schedule.id,
        ),
    );

  if (
    selectedSchedules.length !==
    data.paymentItems.length
  ) {
    throw new Error(
      "One or more fee items are invalid.",
    );
  }

  const calculatedTotal =
    data.paymentItems.reduce(
      (sum, item) =>
        sum + item.amount,
      0,
    );

  if (
    calculatedTotal !==
    data.amountPaid
  ) {
    throw new Error(
      "Amount paid does not match selected fee items.",
    );
  }

  const receiptNumber =
    data.receiptNumber ??
    `RCPT-${new Date().getFullYear()}-${Date.now()}`;

  return financeRepository.createFeePayment({
    ...data,
    receiptNumber,
  });
}

/* -------------------------------------------------------------------------- */
/*                              Update Payment                                */
/* -------------------------------------------------------------------------- */

export async function updateFeePayment(
  id: string,
  schoolId: string,
  data: UpdateFeePaymentInput,
) {
  return financeRepository.updateFeePayment(
    id,
    schoolId,
    data,
  );
}

/* -------------------------------------------------------------------------- */
/*                              Delete Payment                                */
/* -------------------------------------------------------------------------- */

export async function deleteFeePayment(
  id: string,
  schoolId: string,
) {
  return financeRepository.deleteFeePayment(
    id,
    schoolId,
  );
}

/* -------------------------------------------------------------------------- */
/*                              Get Payment                                   */
/* -------------------------------------------------------------------------- */

export async function getPaymentById(
  schoolId: string,
  id: string,
) {
  return financeRepository.getPaymentById(
    schoolId,
    id,
  );
}
/* -------------------------------------------------------------------------- */
/*                         Payment History                                    */
/* -------------------------------------------------------------------------- */

export async function getPaymentHistory(
  schoolId: string,
  admissionId: string,
) {
  return financeRepository.getPaymentHistory(
    schoolId,
    admissionId,
  );
}
/* -------------------------------------------------------------------------- */
/*                             Payment Receipt                                */
/* -------------------------------------------------------------------------- */

export async function getPaymentReceipt(
  schoolId: string,
  paymentId: string,
) {
  return financeRepository.getPaymentReceipt(
    schoolId,
    paymentId,
  );
}