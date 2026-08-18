"use client";

import { useState } from "react";
import FeeItemCard, {
  FeeItemStatus,
} from "./FeeItemCard";

export interface FeeItem {
  id: string;
  title: string;
  amount: number;
  status: FeeItemStatus;
}

interface FeeScheduleProps {
  admissionFee: number;
  monthlyFee: number;
  durationMonths: number;
  certificateFee: number;

  /**
   * IDs already paid.
   *
   * Example:
   * ["admission", "month-1", "month-2"]
   */
  paidItems?: string[];

  onSelectionChange?: (
    items: FeeItem[],
  ) => void;
}

export default function FeeSchedule({
  admissionFee,
  monthlyFee,
  durationMonths,
  certificateFee,
  paidItems = [],
  onSelectionChange,
}: FeeScheduleProps) {
  const [selected, setSelected] =
    useState<string[]>([]);

  const feeItems: FeeItem[] = [
    {
      id: "admission",
      title: "Admission Fee",
      amount: admissionFee,
      status: paidItems.includes("admission")
        ? "PAID"
        : selected.includes("admission")
          ? "SELECTED"
          : "PENDING",
    },

    ...Array.from(
      { length: durationMonths },
      (_, i) => {
        const id = `month-${i + 1}`;

        return {
          id,
          title: `Month ${i + 1}`,
          amount: monthlyFee,
          status: paidItems.includes(id)
            ? "PAID"
            : selected.includes(id)
              ? "SELECTED"
              : "PENDING",
        } satisfies FeeItem;
      },
    ),

    {
      id: "certificate",
      title: "Certificate Fee",
      amount: certificateFee,
      status: paidItems.includes(
        "certificate",
      )
        ? "PAID"
        : selected.includes("certificate")
          ? "SELECTED"
          : "PENDING",
    },
  ];

  function toggle(id: string) {
    if (paidItems.includes(id)) {
      return;
    }

    setSelected((previous) => {
      const next = previous.includes(id)
        ? previous.filter(
            (itemId) => itemId !== id,
          )
        : [...previous, id];

      /*
       * Calculate the selected fee items from
       * the current fee schedule.
       */
      const selectedItems = feeItems.filter(
        (item) => next.includes(item.id),
      );

      onSelectionChange?.(selectedItems);

      return next;
    });
  }

  return (
    <div className="space-y-3">
      {feeItems.map((item) => (
        <FeeItemCard
          key={item.id}
          title={item.title}
          amount={item.amount}
          checked={selected.includes(
            item.id,
          )}
          disabled={paidItems.includes(
            item.id,
          )}
          status={item.status}
          onCheckedChange={() =>
            toggle(item.id)
          }
        />
      ))}
    </div>
  );
}