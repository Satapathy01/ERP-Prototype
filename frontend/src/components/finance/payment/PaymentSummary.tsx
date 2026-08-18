"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee } from "lucide-react";

interface PaymentSummaryProps {
  admissionFee: number;
  courseFee: number;
  alreadyPaid: number;
  selectedToday: number;
}

export default function PaymentSummary({
  admissionFee,
  courseFee,
  alreadyPaid,
  selectedToday,
}: PaymentSummaryProps) {
  const grandTotal = admissionFee + courseFee;

  const outstanding = Math.max(
    grandTotal - alreadyPaid - selectedToday,
    0
  );

  const rows = [
    {
      label: "Admission Fee",
      value: admissionFee,
    },
    {
      label: "Course Fee",
      value: courseFee,
    },
    {
      label: "Already Paid",
      value: alreadyPaid,
    },
    {
      label: "Selected Today",
      value: selectedToday,
      highlight: true,
    },
    {
      label: "Outstanding",
      value: outstanding,
    },
    {
      label: "Grand Total",
      value: grandTotal,
      total: true,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Summary</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className={`flex items-center justify-between rounded-md p-2 ${
              row.highlight
                ? "bg-primary/10"
                : row.total
                ? "bg-muted font-bold"
                : ""
            }`}
          >
            <span>{row.label}</span>

            <span className="flex items-center font-semibold">
              <IndianRupee className="mr-1 h-4 w-4" />
              {row.value.toLocaleString("en-IN")}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}