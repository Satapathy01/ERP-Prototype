import { z } from "zod";

/* -------------------------------------------------------------------------- */
/*                                  Queries                                   */
/* -------------------------------------------------------------------------- */

export const financeQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10),

  search: z.string().trim().min(1).optional(),

  status: z
    .enum([
      "PAID",
      "PENDING",
      "PARTIAL",
      "FAILED",
      "CANCELLED",
    ])
    .optional(),

  paymentMethod: z
    .enum([
      "CASH",
      "UPI",
      "CARD",
      "BANK_TRANSFER",
      "CHEQUE",
      "ONLINE",
    ])
    .optional(),

  from: z.string().optional(),

  to: z.string().optional(),
});

/* -------------------------------------------------------------------------- */
/*                              Payment Items                                 */
/* -------------------------------------------------------------------------- */

export const paymentItemSchema = z.object({
  feeScheduleId: z.string().uuid("Invalid fee schedule ID"),

  title: z.string().min(1),

  amount: z.coerce.number().positive(),
});

/* -------------------------------------------------------------------------- */
/*                              Create Payment                                */
/* -------------------------------------------------------------------------- */

export const createFeePaymentSchema = z.object({
  admissionId: z.string().uuid("Invalid admission ID"),

  receiptNumber: z.string().optional(),

  mrNumber: z.string().optional(),

  receiptDate: z.coerce.date(),

  amountPaid: z.coerce.number().positive(),

  status: z
    .enum([
      "PAID",
      "PENDING",
      "PARTIAL",
      "FAILED",
      "CANCELLED",
    ])
    .default("PAID"),

  paymentMethod: z
    .enum([
      "CASH",
      "UPI",
      "CARD",
      "BANK_TRANSFER",
      "CHEQUE",
      "ONLINE",
    ])
    .default("CASH"),

  transactionId: z.string().optional(),

  remarks: z.string().optional(),

  collectedBy: z.string().optional(),

  paymentItems: z
    .array(paymentItemSchema)
    .min(1, "At least one fee item is required"),
});

/* -------------------------------------------------------------------------- */
/*                              Update Payment                                */
/* -------------------------------------------------------------------------- */

export const updateFeePaymentSchema = createFeePaymentSchema
  .omit({
    admissionId: true,
    paymentItems: true,
  })
  .partial();

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

export type FinanceQuery = z.infer<typeof financeQuerySchema>;

export type PaymentItemInput = z.infer<typeof paymentItemSchema>;

export type CreateFeePaymentInput = z.infer<
  typeof createFeePaymentSchema
>;

export type UpdateFeePaymentInput = z.infer<
  typeof updateFeePaymentSchema
>;