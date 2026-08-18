"use client";

import {
  CreditCard,
  IndianRupee,
  Clock3,
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
  return `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
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
      value: totalCollection,
      icon: IndianRupee,
    },
    {
      title: "Today's Collection",
      value: todayCollection,
      icon: Wallet,
    },
    {
      title: "This Month",
      value: monthlyCollection,
      icon: CreditCard,
    },
    {
      title: "Pending Amount",
      value: pendingAmount,
      icon: Clock3,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>

              <Icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(card.value)}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}