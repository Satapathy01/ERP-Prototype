"use client";

import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

export interface FeePayment {
  id: string;

  receiptNumber?: string | null;

  mrNumber?: string | null;

  receiptDate?: string | Date | null;

  amountPaid: number;

  paymentMethod: string;

  status: string;

  transactionId?: string | null;

  remarks?: string | null;

  collectedBy?: string | null;

  student: {
    id: string;
    name: string;
    registrationNumber: string;
    course?: string | null;
  };
}

interface FinanceTableProps {
  payments: FeePayment[];

  loading?: boolean;

  onView?: (payment: FeePayment) => void;

  onEdit?: (payment: FeePayment) => void;

  onDelete?: (payment: FeePayment) => void;
}

export default function FinanceTable({
  payments,
  loading = false,
  onView,
  onEdit,
  onDelete,
}: FinanceTableProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "PAID":
        return "default";

      case "PENDING":
        return "secondary";

      case "FAILED":
        return "destructive";

      case "CANCELLED":
        return "outline";

      default:
        return "secondary";
    }
  };

  if (loading) {
    return (
      <div className="rounded-lg border p-8 text-center">
        Loading payments...
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center text-muted-foreground">
        No fee payments found.
      </div>
    );
  }

  return (
    <div className="rounded-lg border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Receipt No.</TableHead>

            <TableHead>Student</TableHead>

            <TableHead>Registration</TableHead>

            <TableHead>Course</TableHead>

            <TableHead>Amount</TableHead>

            <TableHead>Method</TableHead>

            <TableHead>Status</TableHead>

            <TableHead>Date</TableHead>

            <TableHead className="text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell className="font-medium">
                {payment.receiptNumber ?? "-"}
              </TableCell>

              <TableCell>
                {payment.student.name}
              </TableCell>

              <TableCell>
                {payment.student.registrationNumber}
              </TableCell>

              <TableCell>
                {payment.student.course ?? "-"}
              </TableCell>

              <TableCell className="font-medium">
                ₹
                {Number(
                  payment.amountPaid
                ).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </TableCell>

              <TableCell>
                {payment.paymentMethod}
              </TableCell>

              <TableCell>
                <Badge
                  variant={getStatusVariant(
                    payment.status
                  )}
                >
                  {payment.status}
                </Badge>
              </TableCell>

              <TableCell>
                {payment.receiptDate
                  ? new Date(
                      payment.receiptDate
                    ).toLocaleDateString("en-IN")
                  : "-"}
              </TableCell>

              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() =>
                      onView?.(payment)
                    }
                  >
                    <Eye className="h-4 w-4" />
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() =>
                      onEdit?.(payment)
                    }
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-red-600"
                    onClick={() =>
                      onDelete?.(payment)
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}