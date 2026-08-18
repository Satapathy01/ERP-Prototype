"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { AdmissionCombobox } from "@/components/admission/admission-combobox";

import StudentPaymentCard, {
  StudentPaymentAdmission,
} from "../payment/StudentPaymentCard";

import FeeSchedule, {
  FeeItem,
} from "../payment/FeeSchedule";

import PaymentSummary from "../payment/PaymentSummary";

import PaymentDetails, {
  PaymentDetailsForm,
} from "../payment/PaymentDetails";

import ReceiptActions from "../payment/ReceiptActions";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  admission?: StudentPaymentAdmission | null;
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function PaymentDialog({
  open,
  onOpenChange,
  admission: initialAdmission = null,
}: PaymentDialogProps) {
  /* ---------------------------------------------------------------------- */
  /* Admission                                                               */
  /* ---------------------------------------------------------------------- */

  const [admission, setAdmission] =
    useState<StudentPaymentAdmission | null>(
      initialAdmission,
    );

  /* ---------------------------------------------------------------------- */
  /* Selected Fee Items                                                      */
  /* ---------------------------------------------------------------------- */

  const [selectedItems, setSelectedItems] =
    useState<FeeItem[]>([]);

  /* ---------------------------------------------------------------------- */
  /* Payment State                                                            */
  /* ---------------------------------------------------------------------- */

  const [loading, setLoading] =
    useState(false);

  const [paymentId, setPaymentId] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState<string | null>(null);

  /* ---------------------------------------------------------------------- */
  /* Form                                                                    */
  /* ---------------------------------------------------------------------- */

  const form = useForm<PaymentDetailsForm>({
    defaultValues: {
      paymentMethod: "CASH",
      collectedBy: "",
      transactionId: "",
      remarks: "",
    },
  });

  /* ---------------------------------------------------------------------- */
  /* Reset dialog when opened                                                */
  /* ---------------------------------------------------------------------- */

  // This effect intentionally synchronizes the dialog's
  // internal state with its open/initialAdmission props.

  /* ---------------------------------------------------------------------- */
  /* Course Fee Values                                                       */
  /* ---------------------------------------------------------------------- */

  const admissionFee = Number(
    admission?.course?.admissionFee ?? 0,
  );

  const monthlyFee = Number(
    admission?.course?.monthlyFee ?? 0,
  );

  const durationMonths = Number(
    admission?.course?.durationMonths ?? 0,
  );

  const certificateFee = Number(
    admission?.course?.certificateFee ?? 0,
  );

  const courseFee =
    monthlyFee * durationMonths +
    certificateFee;

  /* ---------------------------------------------------------------------- */
  /* Selected Amount                                                         */
  /* ---------------------------------------------------------------------- */

  const selectedToday =
    selectedItems.reduce(
      (sum, item) =>
        sum + Number(item.amount),
      0,
    );

  /* ---------------------------------------------------------------------- */
  /* Already Paid                                                            */
  /* ---------------------------------------------------------------------- */

  /*
   * Previous payments are not loaded into
   * the dialog yet.
   *
   * This can later be replaced with the
   * student's actual payment history.
   */
  const alreadyPaid = 0;

  /* ---------------------------------------------------------------------- */
  /* Find Fee Schedule                                                       */
  /* ---------------------------------------------------------------------- */

  function findFeeScheduleId(
    item: FeeItem,
  ): string | null {
    const schedules =
      admission?.course?.feeSchedules ?? [];

    if (item.id === "admission") {
      return (
        schedules.find(
          (schedule) =>
            schedule.title
              .toLowerCase()
              .includes("admission"),
        )?.id ?? null
      );
    }

    if (item.id.startsWith("month-")) {
      return (
        schedules.find(
          (schedule) =>
            schedule.title
              .toLowerCase()
              .includes("monthly"),
        )?.id ?? null
      );
    }

    if (item.id === "certificate") {
      return (
        schedules.find(
          (schedule) =>
            schedule.title
              .toLowerCase()
              .includes("certificate"),
        )?.id ?? null
      );
    }

    return null;
  }

  /* ---------------------------------------------------------------------- */
  /* Save Payment                                                            */
  /* ---------------------------------------------------------------------- */

  async function handleSave() {
    if (!admission) {
      setError(
        "Please select a student.",
      );

      return;
    }

    if (selectedItems.length === 0) {
      setError(
        "Please select at least one fee item.",
      );

      return;
    }

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const details = form.getValues();

      /* ------------------------------------------------------------------ */
      /* Convert UI fee items to database payment items                       */
      /* ------------------------------------------------------------------ */

      const paymentItems = selectedItems
        .filter(
          (item) =>
            Number(item.amount) > 0,
        )
        .map((item) => {
          const feeScheduleId =
            findFeeScheduleId(item);

          if (!feeScheduleId) {
            throw new Error(
              `Fee schedule not found for ${item.title}.`,
            );
          }

          return {
            feeScheduleId,
            title: item.title,
            amount: Number(item.amount),
          };
        });

      if (paymentItems.length === 0) {
        throw new Error(
          "No payable fee items selected.",
        );
      }

      /* ------------------------------------------------------------------ */
      /* Calculate amount paid                                               */
      /* ------------------------------------------------------------------ */

      const amountPaid =
        paymentItems.reduce(
          (sum, item) =>
            sum + item.amount,
          0,
        );

      /* ------------------------------------------------------------------ */
      /* Create payment                                                       */
      /* ------------------------------------------------------------------ */

      const response = await fetch(
        "/api/finance",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            admissionId:
              admission.id,

            receiptDate:
              new Date().toISOString(),

            amountPaid,

            status: "PAID",

            paymentMethod:
              details.paymentMethod,

            transactionId:
              details.transactionId ||
              undefined,

            remarks:
              details.remarks ||
              undefined,

            collectedBy:
              details.collectedBy ||
              undefined,

            paymentItems,
          }),
        },
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ??
            result.error ??
            "Failed to save payment.",
        );
      }

      /* ------------------------------------------------------------------ */
      /* Payment created successfully                                        */
      /* ------------------------------------------------------------------ */

      const createdPayment =
        result.data ?? result;

      setPaymentId(
        createdPayment.id,
      );

      setSuccess(
        `Payment of ₹${amountPaid.toFixed(
          2,
        )} saved successfully.`,
      );

      setSelectedItems([]);
    } catch (err: unknown) {
      console.error(
        "Payment save error:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save payment.",
      );
    } finally {
      setLoading(false);
    }
  }

  /* ---------------------------------------------------------------------- */
  /* Print Receipt                                                           */
  /* ---------------------------------------------------------------------- */

  function printReceipt(
    receiptFormat:
      | "a4"
      | "thermal58"
      | "thermal80",
  ) {
    if (!paymentId) {
      setError(
        "Save the payment before printing the receipt.",
      );

      return;
    }

    const url =
      `/api/finance/${paymentId}/receipt` +
      `?format=${receiptFormat}`;

    window.open(
      url,
      "_blank",
      "noopener,noreferrer",
    );
  }
  function handleDialogOpenChange(nextOpen: boolean) {
  if (nextOpen) {
    setAdmission(initialAdmission ?? null);
    setSelectedItems([]);
    setPaymentId(null);
    setError(null);
    setSuccess(null);

    form.reset({
      paymentMethod: "CASH",
      collectedBy: "",
      transactionId: "",
      remarks: "",
    });
  }

  onOpenChange(nextOpen);
}

  /* ---------------------------------------------------------------------- */
  /* Render                                                                  */
  /* ---------------------------------------------------------------------- */

  return (
    <Dialog
  open={open}
  onOpenChange={handleDialogOpenChange}
>
      <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Collect Fee Payment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* -------------------------------------------------------------- */}
          {/* Select Student                                                   */}
          {/* -------------------------------------------------------------- */}

          {!admission && (
            <div className="rounded-lg border bg-muted/20 p-5">
              <div className="mb-3">
                <h3 className="font-semibold">
                  Select Student
                </h3>

                <p className="text-sm text-muted-foreground">
                  Search for the student/admission
                  to collect the payment.
                </p>
              </div>

              <AdmissionCombobox
                value=""
                onChange={(
                  selectedAdmission,
                ) => {
                  setAdmission(
                    selectedAdmission,
                  );

                  setSelectedItems([]);

                  setPaymentId(null);

                  setError(null);

                  setSuccess(null);
                }}
              />
            </div>
          )}

          {/* -------------------------------------------------------------- */}
          {/* Selected Student                                                 */}
          {/* -------------------------------------------------------------- */}

          {admission && (
            <>
              <StudentPaymentCard
                admission={admission}
              />

              {/* ---------------------------------------------------------- */}
              {/* Change Student                                               */}
              {/* ---------------------------------------------------------- */}

              <div className="rounded-lg border p-4">
                <p className="mb-2 text-sm font-medium">
                  Change Student
                </p>

                <AdmissionCombobox
                  value={admission.id}
                  onChange={(
                    selectedAdmission,
                  ) => {
                    setAdmission(
                      selectedAdmission,
                    );

                    setSelectedItems([]);

                    setPaymentId(null);

                    setError(null);

                    setSuccess(null);
                  }}
                />
              </div>

              {/* ---------------------------------------------------------- */}
              {/* Error                                                         */}
              {/* ---------------------------------------------------------- */}

              {error && (
                <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* ---------------------------------------------------------- */}
              {/* Success                                                       */}
              {/* ---------------------------------------------------------- */}

              {success && (
                <div className="rounded-md border border-green-300 bg-green-50 p-3 text-sm text-green-700">
                  {success}
                </div>
              )}

              {/* ---------------------------------------------------------- */}
              {/* Fee Selection                                                */}
              {/* ---------------------------------------------------------- */}

              <FeeSchedule
                admissionFee={
                  admissionFee
                }
                monthlyFee={
                  monthlyFee
                }
                durationMonths={
                  durationMonths
                }
                certificateFee={
                  certificateFee
                }
                paidItems={[]}
                onSelectionChange={
                  setSelectedItems
                }
              />

              {/* ---------------------------------------------------------- */}
              {/* Payment Summary                                               */}
              {/* ---------------------------------------------------------- */}

              <PaymentSummary
                admissionFee={
                  admissionFee
                }
                courseFee={
                  courseFee
                }
                alreadyPaid={
                  alreadyPaid
                }
                selectedToday={
                  selectedToday
                }
              />

              {/* ---------------------------------------------------------- */}
              {/* Payment Details                                               */}
              {/* ---------------------------------------------------------- */}

              <PaymentDetails
                form={form}
              />

              {/* ---------------------------------------------------------- */}
              {/* Receipt / Payment Actions                                    */}
              {/* ---------------------------------------------------------- */}

              <ReceiptActions
                loading={loading}
                onCancel={() =>
                  onOpenChange(false)
                }
                onSave={handleSave}
                onPrintA4={() =>
                  printReceipt("a4")
                }
                onPrintThermal58={() =>
                  printReceipt(
                    "thermal58",
                  )
                }
                onPrintThermal80={() =>
                  printReceipt(
                    "thermal80",
                  )
                }
              />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}