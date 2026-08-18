"use client";

import { Plus, RotateCcw, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FinanceToolbarProps {
  search: string;
  status: string;
  paymentMethod: string;
  from: string;
  to: string;

  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onPaymentMethodChange: (value: string) => void;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;

  onRefresh: () => void;
  onAdd: () => void;
}

export default function FinanceToolbar({
  search,
  status,
  paymentMethod,
  from,
  to,
  onSearchChange,
  onStatusChange,
  onPaymentMethodChange,
  onFromChange,
  onToChange,
  onRefresh,
  onAdd,
}: FinanceToolbarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-background p-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

        <Input
          placeholder="Search by student, receipt no., MR no..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Filters */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={paymentMethod}
          onValueChange={onPaymentMethodChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Payment Method" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ALL">All Methods</SelectItem>
            <SelectItem value="CASH">Cash</SelectItem>
            <SelectItem value="UPI">UPI</SelectItem>
            <SelectItem value="CARD">Card</SelectItem>
            <SelectItem value="BANK_TRANSFER">
              Bank Transfer
            </SelectItem>
            <SelectItem value="CHEQUE">Cheque</SelectItem>
            <SelectItem value="ONLINE">Online</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="date"
          value={from}
          onChange={(e) => onFromChange(e.target.value)}
        />

        <Input
          type="date"
          value={to}
          onChange={(e) => onToChange(e.target.value)}
        />

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onRefresh}
            className="flex-1"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>

          <Button
            onClick={onAdd}
            className="flex-1"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}