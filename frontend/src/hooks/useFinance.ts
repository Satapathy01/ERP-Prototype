"use client";

import { useCallback, useEffect, useState } from "react";

import type {
  CreateFeePaymentInput,
  UpdateFeePaymentInput,
} from "@/modules/finance/services";

export interface FinanceQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  paymentMethod?: string;
  from?: string;
  to?: string;
}

export interface FinancePayment {
  id: string;
  receiptNumber?: string | null;
  amount: number;
  paymentMethod?: string | null;
  status?: string | null;
  paidAt?: string | null;
  remarks?: string | null;

  admission?: {
    id: string;
    admissionNumber?: string | null;

    student?: {
      id: string;
      name?: string | null;
      registrationNumber?: string | null;
      photo?: string | null;
    } | null;
  } | null;
}

export interface FinancePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

interface FinanceApiResponse {
  success: boolean;
  message?: string;
  data?: {
    payments: FinancePayment[];
    pagination: FinancePagination;
  };
}

export function useFinance(
  initialQuery: FinanceQuery = {},
) {
  const [payments, setPayments] = useState<
    FinancePayment[]
  >([]);

  const [pagination, setPagination] =
    useState<FinancePagination | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(
    null,
  );

  const [query, setQuery] =
    useState<FinanceQuery>(initialQuery);

  /* ---------------------------------------------------------------------- */
  /* Build Query String                                                     */
  /* ---------------------------------------------------------------------- */

  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();

    Object.entries(query).forEach(
      ([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          value !== ""
        ) {
          params.set(key, String(value));
        }
      },
    );

    return params.toString();
  }, [query]);

  /* ---------------------------------------------------------------------- */
  /* Fetch Payments                                                         */
  /* ---------------------------------------------------------------------- */

  const fetchPayments = useCallback(
    async () => {
      try {
        setLoading(true);
        setError(null);

        const queryString =
          buildQueryString();

        const url = queryString
          ? `/api/finance?${queryString}`
          : "/api/finance";

        const response = await fetch(url, {
          credentials: "include",
          cache: "no-store",
        });

        const json =
          (await response.json()) as FinanceApiResponse;

        if (!response.ok || !json.success) {
          throw new Error(
            json.message ??
              "Failed to load payments.",
          );
        }

        setPayments(
          json.data?.payments ?? [],
        );

        setPagination(
          json.data?.pagination ?? null,
        );
      } catch (error: unknown) {
        console.error(
          "Failed to load payments:",
          error,
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load payments.",
        );

        setPayments([]);
        setPagination(null);
      } finally {
        setLoading(false);
      }
    },
    [buildQueryString],
  );

  /* ---------------------------------------------------------------------- */
  /* Get Single Payment                                                     */
  /* ---------------------------------------------------------------------- */

  const getPayment = useCallback(
    async (id: string) => {
      const response = await fetch(
        `/api/finance/${id}`,
        {
          credentials: "include",
          cache: "no-store",
        },
      );

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(
          json.message ??
            "Failed to load payment.",
        );
      }

      return json.data as FinancePayment;
    },
    [],
  );

  /* ---------------------------------------------------------------------- */
  /* Create Payment                                                         */
  /* ---------------------------------------------------------------------- */

  const createPayment = useCallback(
    async (
      data: CreateFeePaymentInput,
    ) => {
      const response = await fetch(
        "/api/finance",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(
          json.message ??
            "Failed to create payment.",
        );
      }

      await fetchPayments();

      return json.data as FinancePayment;
    },
    [fetchPayments],
  );

  /* ---------------------------------------------------------------------- */
  /* Update Payment                                                         */
  /* ---------------------------------------------------------------------- */

  const updatePayment = useCallback(
    async (
      id: string,
      data: UpdateFeePaymentInput,
    ) => {
      const response = await fetch(
        `/api/finance/${id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(
          json.message ??
            "Failed to update payment.",
        );
      }

      await fetchPayments();

      return json.data as FinancePayment;
    },
    [fetchPayments],
  );

  /* ---------------------------------------------------------------------- */
  /* Delete Payment                                                         */
  /* ---------------------------------------------------------------------- */

  const deletePayment = useCallback(
    async (id: string) => {
      const response = await fetch(
        `/api/finance/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(
          json.message ??
            "Failed to delete payment.",
        );
      }

      await fetchPayments();
    },
    [fetchPayments],
  );

  /* ---------------------------------------------------------------------- */
  /* Initial / Query Change Loading                                         */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    // Payment loading is an intentional external side effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPayments();
  }, [fetchPayments]);

  /* ---------------------------------------------------------------------- */
  /* Return                                                                 */
  /* ---------------------------------------------------------------------- */

  return {
    payments,
    pagination,
    loading,
    error,

    query,
    setQuery,

    refresh: fetchPayments,

    getPayment,
    createPayment,
    updatePayment,
    deletePayment,
  };
}