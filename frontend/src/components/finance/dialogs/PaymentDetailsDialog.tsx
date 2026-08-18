"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface FeePayment {
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

interface PaymentDetailsDialogProps {
  open: boolean;

  onOpenChange: (open: boolean) => void;

  payment?: FeePayment | null;
}

export default function PaymentDetailsDialog({
  open,
  onOpenChange,
  payment,
}: PaymentDetailsDialogProps) {
  if (!payment) return null;

  const statusVariant = () => {
    switch (payment.status) {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Payment Details</DialogTitle>

          <DialogDescription>
            View fee payment information.
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <div className="grid gap-4 py-2 md:grid-cols-2">
          <Info
            label="Student Name"
            value={payment.student.name}
          />

          <Info
            label="Registration No."
            value={payment.student.registrationNumber}
          />

          <Info
            label="Course"
            value={payment.student.course ?? "-"}
          />

          <Info
            label="Receipt Number"
            value={payment.receiptNumber ?? "-"}
          />

          <Info
            label="MR Number"
            value={payment.mrNumber ?? "-"}
          />

          <Info
            label="Amount Paid"
            value={`₹${Number(payment.amountPaid).toLocaleString(
              "en-IN",
              {
                minimumFractionDigits: 2,
              }
            )}`}
          />

          <Info
            label="Payment Method"
            value={payment.paymentMethod}
          />

          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Status
            </p>

            <Badge variant={statusVariant()}>
              {payment.status}
            </Badge>
          </div>

          <Info
            label="Receipt Date"
            value={
              payment.receiptDate
                ? new Date(
                    payment.receiptDate
                  ).toLocaleDateString("en-IN")
                : "-"
            }
          />

          <Info
            label="Collected By"
            value={payment.collectedBy ?? "-"}
          />

          <Info
            label="Transaction ID"
            value={payment.transactionId ?? "-"}
          />
        </div>

        <Separator />

        <div>
          <h3 className="font-medium mb-2">
            Remarks
          </h3>

          <div className="rounded-md border p-3 min-h-24 text-sm">
            {payment.remarks || "No remarks available."}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface InfoProps {
  label: string;
  value: React.ReactNode;
}

function Info({ label, value }: InfoProps) {
  return (
    <div>
      <p className="text-sm text-muted-foreground mb-1">
        {label}
      </p>

      <p className="font-medium">{value}</p>
    </div>
  );
}