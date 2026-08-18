"use client";

import { useCallback, useEffect, useState } from "react";

import {
  FinanceHeader,
  FinanceCards,
  FinanceToolbar,
  FinanceTable,
  FinancePagination,
  PaymentDialog,
  PaymentDetailsDialog,
  DeletePaymentDialog,
} from "@/components/finance";

import type { FeePayment } from "@/components/finance";

import { useFinanceDashboard } from "@/hooks/useFinanceDashboard";

interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export default function FinancePage() {
  const { data: dashboard, loading: dashboardLoading } =
    useFinanceDashboard();

  /* ---------------------------------------------------------------------- */
  /* Payment State                                                          */
  /* ---------------------------------------------------------------------- */

  const [payments, setPayments] = useState<FeePayment[]>([]);
  const [loading, setLoading] = useState(true);

  const [pagination, setPagination] =
    useState<PaginationState>({
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    });

  /* ---------------------------------------------------------------------- */
  /* Filters                                                                */
  /* ---------------------------------------------------------------------- */

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [paymentMethod, setPaymentMethod] =
    useState("ALL");

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  /* ---------------------------------------------------------------------- */
  /* Dialog State                                                           */
  /* ---------------------------------------------------------------------- */

  const [createOpen, setCreateOpen] = useState(false);

  const [detailsOpen, setDetailsOpen] =
    useState(false);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [selectedPayment, setSelectedPayment] =
    useState<FeePayment | null>(null);

  /* ---------------------------------------------------------------------- */
  /* Load Payments                                                          */
  /* ---------------------------------------------------------------------- */

  const loadPayments = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      params.set("page", String(pagination.page));
      params.set("limit", String(pagination.limit));

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (status !== "ALL") {
        params.set("status", status);
      }

      if (paymentMethod !== "ALL") {
        params.set("paymentMethod", paymentMethod);
      }

      if (from) {
        params.set("from", from);
      }

      if (to) {
        params.set("to", to);
      }

      const response = await fetch(
        `/api/finance?${params.toString()}`,
        {
          cache: "no-store",
        },
      );

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(
          json.message || "Failed to load payments.",
        );
      }

      const result = json.data;

      setPayments(result?.payments ?? []);

      if (result?.pagination) {
        setPagination(result.pagination);
      }
    } catch (error) {
      console.error(
        "Failed to load finance payments:",
        error,
      );

      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, [
    pagination.page,
    pagination.limit,
    search,
    status,
    paymentMethod,
    from,
    to,
  ]);

useEffect(() => {
  // Fetching is an external side effect and intentionally updates
  // loading/payment state when the request completes.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  loadPayments();
}, [loadPayments]);
  /* ---------------------------------------------------------------------- */
  /* Search / Filter Handlers                                               */
  /* ---------------------------------------------------------------------- */

  function handleSearchChange(value: string) {
    setSearch(value);

    setPagination((previous) => ({
      ...previous,
      page: 1,
    }));
  }

  function handleStatusChange(value: string) {
    setStatus(value);

    setPagination((previous) => ({
      ...previous,
      page: 1,
    }));
  }

  function handlePaymentMethodChange(
    value: string,
  ) {
    setPaymentMethod(value);

    setPagination((previous) => ({
      ...previous,
      page: 1,
    }));
  }

  function handleFromChange(value: string) {
    setFrom(value);

    setPagination((previous) => ({
      ...previous,
      page: 1,
    }));
  }

  function handleToChange(value: string) {
    setTo(value);

    setPagination((previous) => ({
      ...previous,
      page: 1,
    }));
  }

  /* ---------------------------------------------------------------------- */
  /* Payment Actions                                                        */
  /* ---------------------------------------------------------------------- */

  function handleView(payment: FeePayment) {
    setSelectedPayment(payment);
    setDetailsOpen(true);
  }

  function handleEdit(payment: FeePayment) {
    console.log("Edit payment:", payment);

    // Edit dialog can be connected here later.
  }

  async function handleDelete(
    paymentId: string,
  ) {
    /*
     * Your current /api/finance route has GET and POST.
     * Keep deletion disabled until the DELETE route is wired.
     */
    console.log(
      "Delete payment requested:",
      paymentId,
    );

    throw new Error(
      "Payment delete API is not connected yet.",
    );
  }

  function handleDeleteRequest(
    payment: FeePayment,
  ) {
    setSelectedPayment(payment);
    setDeleteOpen(true);
  }

  function handlePageChange(page: number) {
    setPagination((previous) => ({
      ...previous,
      page,
    }));
  }

  /* ---------------------------------------------------------------------- */
  /* Render                                                                 */
  /* ---------------------------------------------------------------------- */

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <FinanceHeader
        onCreate={() => {
          setSelectedPayment(null);
          setCreateOpen(true);
        }}
      />

      {/* Summary Cards */}
      {dashboardLoading ? (
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-32 animate-pulse rounded-lg bg-muted"
              />
            ),
          )}
        </div>
      ) : (
        <FinanceCards
          totalCollection={
            dashboard.totalCollection
          }
          todayCollection={
            dashboard.todayCollection
          }
          monthlyCollection={
            dashboard.monthlyCollection
          }
          pendingAmount={
            dashboard.pendingAmount
          }
        />
      )}

      {/* Toolbar */}
      <FinanceToolbar
        search={search}
        status={status}
        paymentMethod={paymentMethod}
        from={from}
        to={to}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onPaymentMethodChange={
          handlePaymentMethodChange
        }
        onFromChange={handleFromChange}
        onToChange={handleToChange}
        onRefresh={loadPayments}
        onAdd={() => {
          setSelectedPayment(null);
          setCreateOpen(true);
        }}
      />

      {/* Table */}
      <FinanceTable
        payments={payments}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
      />

      {/* Pagination */}
      <FinancePagination
        pagination={pagination}
        onPageChange={handlePageChange}
      />

      {/* Create Payment Dialog */}
      <PaymentDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        admission={null}
      />

      {/* Payment Details */}
      <PaymentDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        payment={selectedPayment}
      />

      {/* Delete Payment */}
      <DeletePaymentDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        paymentId={
          selectedPayment?.id
        }
        receiptNumber={
          selectedPayment?.receiptNumber
        }
        onDelete={handleDelete}
      />
    </div>
  );
}