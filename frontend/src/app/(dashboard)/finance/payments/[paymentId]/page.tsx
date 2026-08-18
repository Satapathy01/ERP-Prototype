import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Props {
  params: Promise<{
    paymentId: string;
  }>;
}

export default async function PaymentDetailsPage({
  params,
}: Props) {
  const { paymentId } = await params;

  const payment = await prisma.feePayment.findUnique({
    where: {
      id: paymentId,
    },
    include: {
      admission: {
        include: {
          student: true,
          course: true,
          batch: true,
        },
      },
    },
  });

  if (!payment) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-5xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Payment Details
          </h1>

          <p className="text-muted-foreground">
            Receipt #{payment.receiptNumber}
          </p>
        </div>

        <Button asChild>
          <Link
            href={`/finance/payments/${payment.id}/receipt`}
          >
            Print Receipt
          </Link>
        </Button>
      </div>

      {/* Student Information */}
      <Card>
        <CardHeader>
          <CardTitle>Student</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 md:grid-cols-2">
          <Info
            label="Student"
            value={payment.admission.student.name}
          />

          <Info
            label="Registration No"
            value={
              payment.admission.student.registrationNumber
            }
          />

          <Info
            label="Course"
            value={payment.admission.course.code}
          />

          <Info
            label="Batch"
            value={
              payment.admission.batch?.name ??
              "Not Assigned"
            }
          />

          <Info
            label="Teacher"
            value="-"
          />
        </CardContent>
      </Card>

      {/* Payment Information */}
      <Card>
        <CardHeader>
          <CardTitle>Payment</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 md:grid-cols-2">
          <Info
            label="Receipt Number"
            value={payment.receiptNumber}
          />

          <Info
            label="MR Number"
            value={payment.mrNumber}
          />

          <Info
            label="Amount Paid"
            value={`₹${payment.amountPaid}`}
          />

          <Info
            label="Payment Method"
            value={payment.paymentMethod}
          />

          <Info
            label="Status"
            value={<Badge>{payment.status}</Badge>}
          />

          <Info
            label="Receipt Date"
            value={
              payment.receiptDate
                ? payment.receiptDate.toLocaleDateString(
                    "en-IN",
                  )
                : "-"
            }
          />

          <Info
            label="Transaction ID"
            value={payment.transactionId ?? "-"}
          />

          <Info
            label="Collected By"
            value={payment.collectedBy ?? "-"}
          />
        </CardContent>
      </Card>

      {/* Remarks */}
      {payment.remarks && (
        <Card>
          <CardHeader>
            <CardTitle>Remarks</CardTitle>
          </CardHeader>

          <CardContent>
            {payment.remarks}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">
        {label}
      </p>

      <div className="font-medium">
        {value}
      </div>
    </div>
  );
}