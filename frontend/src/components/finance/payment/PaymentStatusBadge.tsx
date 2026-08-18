"use client";

import { Badge } from "@/components/ui/badge";

interface PaymentStatusBadgeProps {
  status: "PAID" | "PENDING" | "FAILED" | "CANCELLED" | string;
}

export default function PaymentStatusBadge({
  status,
}: PaymentStatusBadgeProps) {
  switch (status) {
    case "PAID":
      return (
        <Badge className="bg-green-600 hover:bg-green-700 text-white">
          Paid
        </Badge>
      );

    case "PENDING":
      return (
        <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
          Pending
        </Badge>
      );

    case "FAILED":
      return (
        <Badge variant="destructive">
          Failed
        </Badge>
      );

    case "CANCELLED":
      return (
        <Badge
          variant="outline"
          className="border-red-500 text-red-600"
        >
          Cancelled
        </Badge>
      );

    default:
      return (
        <Badge variant="secondary">
          {status}
        </Badge>
      );
  }
}