"use client";

import {
  ChevronDown,
  Printer,
  Receipt,
  Save,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ReceiptActionsProps {
  loading?: boolean;

  onCancel: () => void;

  onSave: () => void;

  onPrintA4: () => void;

  onPrintThermal58: () => void;

  onPrintThermal80: () => void;
}

export default function ReceiptActions({
  loading = false,
  onCancel,
  onSave,
  onPrintA4,
  onPrintThermal58,
  onPrintThermal80,
}: ReceiptActionsProps) {
  return (
    <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:justify-between">

      <Button
        variant="outline"
        onClick={onCancel}
      >
        <X className="mr-2 h-4 w-4" />
        Cancel
      </Button>

      <div className="flex flex-col gap-3 sm:flex-row">

        <Button
          onClick={onSave}
          disabled={loading}
        >
          <Save className="mr-2 h-4 w-4" />

          {loading
            ? "Saving..."
            : "Save Payment"}
        </Button>

        <DropdownMenu>

          <DropdownMenuTrigger asChild>

            <Button variant="secondary">

              <Printer className="mr-2 h-4 w-4" />

              Print Receipt

              <ChevronDown className="ml-2 h-4 w-4" />

            </Button>

          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">

            <DropdownMenuItem onClick={onPrintThermal58}>
              <Receipt className="mr-2 h-4 w-4" />
              Thermal Receipt (58mm)
            </DropdownMenuItem>

            <DropdownMenuItem onClick={onPrintThermal80}>
              <Receipt className="mr-2 h-4 w-4" />
              Thermal Receipt (80mm)
            </DropdownMenuItem>

            <DropdownMenuItem onClick={onPrintA4}>
              <Printer className="mr-2 h-4 w-4" />
              A4 Receipt
            </DropdownMenuItem>

          </DropdownMenuContent>

        </DropdownMenu>

      </div>

    </div>
  );
}