import * as financeService from "./finance.service";

import {
  financeQuerySchema,
  createFeePaymentSchema,
  updateFeePaymentSchema,
} from "./finance.schema";

/* -------------------------------------------------------------------------- */
/*                               Get Payments                                 */
/* -------------------------------------------------------------------------- */

export async function getFeePayments(
  schoolId: string,
  query: unknown,
) {
  return financeService.getFeePayments(
    schoolId,
    financeQuerySchema.parse(query),
  );
}

/* -------------------------------------------------------------------------- */
/*                              Create Payment                                */
/* -------------------------------------------------------------------------- */

export async function createPayment(
  schoolId: string,
  body: unknown,
) {
  return financeService.createPayment(
    schoolId,
    createFeePaymentSchema.parse(body),
  );
}

/* -------------------------------------------------------------------------- */
/*                              Update Payment                                */
/* -------------------------------------------------------------------------- */

export async function updatePayment(
  paymentId: string,
  schoolId: string,
  body: unknown,
) {
  return financeService.updateFeePayment(
    paymentId,
    schoolId,
    updateFeePaymentSchema.parse(body),
  );
}

/* -------------------------------------------------------------------------- */
/*                              Delete Payment                                */
/* -------------------------------------------------------------------------- */

export async function deletePayment(
  paymentId: string,
  schoolId: string,
) {
  return financeService.deleteFeePayment(
    paymentId,
    schoolId,
  );
}

/* -------------------------------------------------------------------------- */
/*                              Get Payment                                   */
/* -------------------------------------------------------------------------- */

export async function getPayment(
  paymentId: string,
  schoolId: string,
) {
  return financeService.getPaymentById(
    schoolId,
    paymentId,
  );
}
/* -------------------------------------------------------------------------- */
/*                         Payment History                                    */
/* -------------------------------------------------------------------------- */

export async function getPaymentHistory(
  schoolId: string,
  admissionId: string,
) {
  return financeService.getPaymentHistory(
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
  return financeService.getPaymentReceipt(
    schoolId,
    paymentId,
  );
}