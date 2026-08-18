"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface Payment {
  id: string;

  admission?: {
    student?: {
      name?: string | null;
    };

    course?: {
      name?: string | null;
    };
  };

  amountPaid: number | string;

  receiptDate: string;

  status: string;
}

interface FinanceResponse {
  success: boolean;

  data?: {
    payments?: Payment[];

    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrevious: boolean;
    };
  };

  message?: string;
}

function formatDate(date: string) {
  if (!date) {
    return "-";
  }

  const paymentDate = new Date(date);

  if (Number.isNaN(paymentDate.getTime())) {
    return "-";
  }

  const today = new Date();

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (
    paymentDate.toDateString() ===
    today.toDateString()
  ) {
    return "Today";
  }

  if (
    paymentDate.toDateString() ===
    yesterday.toDateString()
  ) {
    return "Yesterday";
  }

  return paymentDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

function normalizeStatus(
  status: string,
): "Paid" | "Pending" | "Failed" {
  const normalized = status.toUpperCase();

  if (
    normalized === "PAID" ||
    normalized === "COMPLETED"
  ) {
    return "Paid";
  }

  if (
    normalized === "FAILED" ||
    normalized === "CANCELLED"
  ) {
    return "Failed";
  }

  return "Pending";
}

function StatusBadge({
  status,
}: {
  status: "Paid" | "Pending" | "Failed";
}) {
  switch (status) {
    case "Paid":
      return (
        <Badge className="bg-green-600 hover:bg-green-600">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Paid
        </Badge>
      );

    case "Pending":
      return (
        <Badge
          variant="secondary"
          className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
        >
          <Clock3 className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      );

    case "Failed":
      return (
        <Badge variant="destructive">
          <XCircle className="mr-1 h-3 w-3" />
          Failed
        </Badge>
      );
  }
}

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase() || "S"
  );
}

export default function RecentPayments() {
  const [payments, setPayments] =
    useState<Payment[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPayments() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          "/api/finance?page=1&limit=5",
          {
            cache: "no-store",
            credentials: "include",
          },
        );

        const json =
          (await response.json()) as FinanceResponse;

        if (!response.ok || !json.success) {
          throw new Error(
            json.message ??
              "Failed to load recent payments.",
          );
        }

        if (!cancelled) {
          setPayments(
            json.data?.payments ?? [],
          );
        }
      } catch (error) {
        console.error(
          "Failed to load recent payments:",
          error,
        );

        if (!cancelled) {
          setPayments([]);

          setError(
            "Unable to load recent payments.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPayments();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Card className="rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>
            Recent Payments
          </CardTitle>

          <CardDescription>
            Latest fee transactions
          </CardDescription>
        </div>

        <Button
          asChild
          variant="ghost"
          size="sm"
        >
          <Link href="/dashboard/operations/finance">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {loading ? (
          <>
            {Array.from({ length: 5 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-20 animate-pulse rounded-xl border bg-muted/30"
                />
              ),
            )}
          </>
        ) : error ? (
          <div className="py-8 text-center text-sm text-destructive">
            {error}
          </div>
        ) : payments.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No payments recorded yet.
          </div>
        ) : (
          payments.map((payment) => {
            const studentName =
              payment.admission?.student?.name ??
              "Unknown Student";

            const courseName =
              payment.admission?.course?.name ??
              "Unknown Course";

            const status =
              normalizeStatus(payment.status);

            const amount = Number(
              payment.amountPaid,
            );

            return (
              <Link
                key={payment.id}
                href={`/dashboard/finance/payments/${payment.id}`}
                className="block"
              >
                <div className="flex items-center justify-between rounded-xl border p-4 transition-colors hover:bg-muted/40">
                  <div className="flex min-w-0 items-center gap-4">
                    <Avatar className="shrink-0">
                      <AvatarFallback>
                        {getInitials(
                          studentName,
                        )}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                      <h4 className="truncate font-medium">
                        {studentName}
                      </h4>

                      <p className="truncate text-sm text-muted-foreground">
                        {courseName}
                      </p>
                    </div>
                  </div>

                  <div className="ml-4 hidden shrink-0 text-right sm:block">
                    <p className="font-semibold">
                      ₹
                      {Number.isFinite(amount)
                        ? amount.toLocaleString(
                            "en-IN",
                          )
                        : "0"}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {formatDate(
                        payment.receiptDate,
                      )}
                    </p>
                  </div>

                  <div className="ml-3 shrink-0">
                    <StatusBadge
                      status={status}
                    />
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}