"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface FinanceHeaderProps {
  onCreate: () => void;
}

export default function FinanceHeader({
  onCreate,
}: FinanceHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Finance Management
        </h1>

        <p className="text-muted-foreground">
          Manage fee collections, receipts and payment history.
        </p>
      </div>

      <Button onClick={onCreate}>
        <Plus className="mr-2 h-4 w-4" />
        New Payment
      </Button>
    </div>
  );
}