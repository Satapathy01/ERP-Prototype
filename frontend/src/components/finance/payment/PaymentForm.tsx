"use client";

import { useEffect, useState } from "react";
import {
  useForm,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  createFeePaymentSchema,
  type CreateFeePaymentInput,
} from "@/modules/finance/services/finance.schema";

import type {
  AdmissionSearchResult,
  FeeSchedule,
} from "src/modules/finance/services/types";

import { AdmissionCombobox } from "@/components/admission/admission-combobox";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PaymentFormProps {
  defaultValues?: Partial<CreateFeePaymentInput>;
  loading?: boolean;

  onSubmit: (
    values: CreateFeePaymentInput,
  ) => Promise<void> | void;
}

export default function PaymentForm({
  defaultValues,
  loading = false,
  onSubmit,
}: PaymentFormProps) {
  const form = useForm<
    z.input<typeof createFeePaymentSchema>,
    unknown,
    z.output<typeof createFeePaymentSchema>
  >({
    resolver: zodResolver(
      createFeePaymentSchema,
    ),

    defaultValues: {
      admissionId: "",
      receiptNumber: "",
      mrNumber: "",
      receiptDate: new Date(),

      amountPaid: 0,

      status: "PAID",

      paymentMethod: "CASH",

      transactionId: "",

      remarks: "",

      collectedBy: "",

      paymentItems: [],

      ...defaultValues,
    },
  });

  const [
    selectedAdmission,
    setSelectedAdmission,
  ] = useState<AdmissionSearchResult | null>(
    null,
  );

  /*
   * React Compiler-safe React Hook Form
   * subscriptions.
   *
   * Do not use form.watch() directly.
   */
  const paymentItems =
    useWatch({
      control: form.control,
      name: "paymentItems",
    }) ?? [];

  const paymentMethod = useWatch({
    control: form.control,
    name: "paymentMethod",
  });

  /*
   * Reset form when default values change.
   *
   * Do not call setState() here.
   */
  useEffect(() => {
    form.reset({
      admissionId: "",
      receiptNumber: "",
      mrNumber: "",
      receiptDate: new Date(),

      amountPaid: 0,

      status: "PAID",

      paymentMethod: "CASH",

      transactionId: "",

      remarks: "",

      collectedBy: "",

      paymentItems: [],

      ...defaultValues,
    });
  }, [defaultValues, form]);

  // --------------------------------------------------
  // Fee selection
  // --------------------------------------------------

  function toggleFeeSchedule(
    schedule: FeeSchedule,
  ) {
    const exists = paymentItems.some(
      (item) =>
        item.feeScheduleId === schedule.id,
    );

    if (exists) {
      const nextItems =
        paymentItems.filter(
          (item) =>
            item.feeScheduleId !==
            schedule.id,
        );

      form.setValue(
        "paymentItems",
        nextItems,
        {
          shouldDirty: true,
          shouldValidate: true,
        },
      );

      form.setValue(
        "amountPaid",
        nextItems.reduce(
          (sum, item) =>
            sum + Number(item.amount),
          0,
        ),
        {
          shouldDirty: true,
          shouldValidate: true,
        },
      );

      return;
    }

    const nextItems = [
      ...paymentItems,
      {
        feeScheduleId: schedule.id,
        title: schedule.title,
        amount: Number(schedule.amount),
      },
    ];

    form.setValue(
      "paymentItems",
      nextItems,
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );

    form.setValue(
      "amountPaid",
      nextItems.reduce(
        (sum, item) =>
          sum + Number(item.amount),
        0,
      ),
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  }

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------

  async function handleSubmit(
    values: CreateFeePaymentInput,
  ) {
    await onSubmit(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          handleSubmit,
        )}
        className="space-y-6"
      >
        {/* ================================================== */}
        {/* STUDENT / ADMISSION */}
        {/* ================================================== */}

        <FormField
          control={form.control}
          name="admissionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Student
              </FormLabel>

              <FormControl>
                <AdmissionCombobox
                  value={field.value}
                  onChange={(admission) => {
                    field.onChange(
                      admission.id,
                    );

                    setSelectedAdmission(
                      admission,
                    );

                    form.setValue(
                      "paymentItems",
                      [],
                      {
                        shouldDirty: true,
                        shouldValidate: true,
                      },
                    );

                    form.setValue(
                      "amountPaid",
                      0,
                      {
                        shouldDirty: true,
                        shouldValidate: true,
                      },
                    );
                  }}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* ================================================== */}
        {/* SELECTED STUDENT */}
        {/* ================================================== */}

        {selectedAdmission && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>
                  Student Details
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Student
                    </p>

                    <p className="font-medium">
                      {
                        selectedAdmission
                          .student.name
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Registration No.
                    </p>

                    <p className="font-medium">
                      {
                        selectedAdmission
                          .student
                          .registrationNumber
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Course
                    </p>

                    <p className="font-medium">
                      {
                        selectedAdmission
                          .course.code
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Batch
                    </p>

                    <p className="font-medium">
                      {
                        selectedAdmission
                          .batch?.name ??
                        "No Batch"
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ================================================== */}
            {/* FEE SCHEDULES */}
            {/* ================================================== */}

            <Card>
              <CardHeader>
                <CardTitle>
                  Select Fee Items
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                {selectedAdmission.course.feeSchedules
                  .filter(
                    (schedule) =>
                      schedule.isActive,
                  )
                  .sort(
                    (a, b) =>
                      a.dueOrder -
                      b.dueOrder,
                  )
                  .map((schedule) => {
                    const selected =
                      paymentItems.some(
                        (item) =>
                          item.feeScheduleId ===
                          schedule.id,
                      );

                    const isMonthly =
                      schedule.title
                        .toLowerCase()
                        .includes(
                          "monthly",
                        );

                    return (
                      <button
                        type="button"
                        key={schedule.id}
                        onClick={() =>
                          toggleFeeSchedule(
                            schedule,
                          )
                        }
                        className={`w-full rounded-xl border p-4 text-left transition ${
                          selected
                            ? "border-primary bg-primary/5"
                            : "hover:bg-muted"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-start gap-3">
                            <div
                              className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                                selected
                                  ? "border-primary bg-primary text-white"
                                  : "border-muted-foreground/30"
                              }`}
                            >
                              {selected &&
                                "✓"}
                            </div>

                            <div>
                              <p className="font-medium">
                                {
                                  schedule.title
                                }
                              </p>

                              {isMonthly && (
                                <p className="mt-1 text-xs text-muted-foreground">
                                  ₹
                                  {Number(
                                    schedule.amount,
                                  ).toLocaleString(
                                    "en-IN",
                                  )}
                                  ×{" "}
                                  {
                                    selectedAdmission
                                      .course
                                      .installmentCount
                                  }{" "}
                                  months
                                </p>
                              )}

                              {!isMonthly && (
                                <p className="mt-1 text-xs text-muted-foreground">
                                  {schedule.isMandatory
                                    ? "Mandatory"
                                    : "Optional"}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="font-semibold">
                              ₹
                              {Number(
                                schedule.amount,
                              ).toLocaleString(
                                "en-IN",
                              )}
                            </p>

                            <p className="text-xs text-muted-foreground">
                              {selected
                                ? "SELECTED"
                                : "PENDING"}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}

                {/* COURSE FEE BREAKDOWN */}

                <div className="mt-5 rounded-xl bg-muted/40 p-4">
                  <p className="mb-3 font-medium">
                    Course Fee Breakdown
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>
                        Admission Fee
                      </span>

                      <span>
                        ₹
                        {Number(
                          selectedAdmission
                            .course
                            .admissionFee,
                        ).toLocaleString(
                          "en-IN",
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>
                        Monthly Fee
                      </span>

                      <span>
                        ₹
                        {Number(
                          selectedAdmission
                            .course
                            .monthlyFee,
                        ).toLocaleString(
                          "en-IN",
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between text-muted-foreground">
                      <span>
                        Monthly Installments
                      </span>

                      <span>
                        {
                          selectedAdmission
                            .course
                            .installmentCount
                        }{" "}
                        months
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>
                        Monthly Fee Total
                      </span>

                      <span>
                        ₹
                        {(
                          Number(
                            selectedAdmission
                              .course
                              .monthlyFee,
                          ) *
                          Number(
                            selectedAdmission
                              .course
                              .installmentCount,
                          )
                        ).toLocaleString(
                          "en-IN",
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>
                        Certificate Fee
                      </span>

                      <span>
                        ₹
                        {Number(
                          selectedAdmission
                            .course
                            .certificateFee,
                        ).toLocaleString(
                          "en-IN",
                        )}
                      </span>
                    </div>

                    <div className="mt-3 flex justify-between border-t pt-3 font-semibold">
                      <span>
                        Total Course Fee
                      </span>

                      <span>
                        ₹
                        {Number(
                          selectedAdmission
                            .course
                            .totalFee,
                        ).toLocaleString(
                          "en-IN",
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* SELECTED TOTAL */}

                {paymentItems.length > 0 && (
                  <div className="flex justify-between border-t pt-4">
                    <span className="font-medium">
                      Selected Today
                    </span>

                    <span className="text-lg font-bold">
                      ₹
                      {paymentItems
                        .reduce(
                          (sum, item) =>
                            sum +
                            Number(
                              item.amount,
                            ),
                          0,
                        )
                        .toLocaleString(
                          "en-IN",
                        )}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* ================================================== */}
        {/* RECEIPT DETAILS */}
        {/* ================================================== */}

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="receiptNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Receipt Number
                </FormLabel>

                <FormControl>
                  <Input
                    {...field}
                    value={
                      field.value ?? ""
                    }
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mrNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  MR Number
                </FormLabel>

                <FormControl>
                  <Input
                    {...field}
                    value={
                      field.value ?? ""
                    }
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ================================================== */}
        {/* AMOUNT + DATE */}
        {/* ================================================== */}

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="amountPaid"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Amount Paid
                </FormLabel>

                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={Number(
                      field.value ?? 0,
                    )}
                    onChange={(event) =>
                      field.onChange(
                        Number(
                          event.target.value,
                        ),
                      )
                    }
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="receiptDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Receipt Date
                </FormLabel>

                <FormControl>
                  <Input
                    type="date"
                    value={
                      field.value instanceof
                      Date
                        ? field.value
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(event) => {
                      const value =
                        event.target.value;

                      field.onChange(
                        value
                          ? new Date(value)
                          : undefined,
                      );
                    }}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ================================================== */}
        {/* PAYMENT METHOD + STATUS */}
        {/* ================================================== */}

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Payment Method
                </FormLabel>

                <Select
                  value={field.value}
                  onValueChange={
                    field.onChange
                  }
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    <SelectItem value="CASH">
                      Cash
                    </SelectItem>

                    <SelectItem value="UPI">
                      UPI
                    </SelectItem>

                    <SelectItem value="CARD">
                      Card
                    </SelectItem>

                    <SelectItem value="BANK_TRANSFER">
                      Bank Transfer
                    </SelectItem>

                    <SelectItem value="CHEQUE">
                      Cheque
                    </SelectItem>

                    <SelectItem value="ONLINE">
                      Online
                    </SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Status
                </FormLabel>

                <Select
                  value={field.value}
                  onValueChange={
                    field.onChange
                  }
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    <SelectItem value="PAID">
                      Paid
                    </SelectItem>

                    <SelectItem value="PENDING">
                      Pending
                    </SelectItem>

                    <SelectItem value="FAILED">
                      Failed
                    </SelectItem>

                    <SelectItem value="CANCELLED">
                      Cancelled
                    </SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ================================================== */}
        {/* TRANSACTION ID */}
        {/* ================================================== */}

        {paymentMethod !== "CASH" && (
          <FormField
            control={form.control}
            name="transactionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Transaction ID
                </FormLabel>

                <FormControl>
                  <Input
                    {...field}
                    value={
                      field.value ?? ""
                    }
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* ================================================== */}
        {/* COLLECTED BY */}
        {/* ================================================== */}

        <FormField
          control={form.control}
          name="collectedBy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Collected By
              </FormLabel>

              <FormControl>
                <Input
                  {...field}
                  value={
                    field.value ?? ""
                  }
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* ================================================== */}
        {/* REMARKS */}
        {/* ================================================== */}

        <FormField
          control={form.control}
          name="remarks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Remarks
              </FormLabel>

              <FormControl>
                <Textarea
                  rows={4}
                  {...field}
                  value={
                    field.value ?? ""
                  }
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* ================================================== */}
        {/* SUBMIT */}
        {/* ================================================== */}

        <Button
          type="submit"
          disabled={
            loading ||
            !selectedAdmission ||
            paymentItems.length === 0
          }
        >
          {loading
            ? "Saving..."
            : "Save Payment"}
        </Button>
      </form>
    </Form>
  );
}