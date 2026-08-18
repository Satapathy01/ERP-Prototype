"use client";

import {
  CalendarDays,
  CreditCard,
  IndianRupee,
  Wallet,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FinanceCardsProps {
  totalCollection: number;
  todayCollection: number;
  monthlyCollection: number;
  pendingAmount: number;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function FinanceCards({
  totalCollection,
  todayCollection,
  monthlyCollection,
  pendingAmount,
}: FinanceCardsProps) {
  const cards = [
    {
      title: "Total Collection",
      value: formatCurrency(totalCollection),
      icon: IndianRupee,
    },
    {
      title: "Today's Collection",
      value: formatCurrency(todayCollection),
      icon: CalendarDays,
    },
    {
      title: "Monthly Collection",
      value: formatCurrency(monthlyCollection),
      icon: CreditCard,
    },
    {
      title: "Pending Amount",
      value: formatCurrency(pendingAmount),
      icon: Wallet,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>

              <Icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">
                {card.value}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}