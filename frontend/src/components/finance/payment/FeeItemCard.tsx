"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type FeeItemStatus = "PENDING" | "SELECTED" | "PAID";

interface FeeItemCardProps {
  title: string;
  amount: number;

  checked: boolean;
  disabled?: boolean;

  status: FeeItemStatus;

  onCheckedChange: (checked: boolean) => void;
}

export default function FeeItemCard({
  title,
  amount,
  checked,
  disabled = false,
  status,
  onCheckedChange,
}: FeeItemCardProps) {
  return (
    <Card
      className={cn(
        "transition-all cursor-pointer border p-4",
        checked && "border-primary bg-primary/5",
        disabled && "opacity-70 cursor-not-allowed"
      )}
      onClick={() => {
        if (!disabled) {
          onCheckedChange(!checked);
        }
      }}
    >
      <div className="flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-3">
          <Checkbox
            checked={checked}
            disabled={disabled}
            onCheckedChange={(value) =>
              onCheckedChange(Boolean(value))
            }
          />

          <div>
            <h4 className="font-medium">{title}</h4>

            <p className="text-sm text-muted-foreground">
              ₹{amount.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* Right */}
        <Badge
          variant={
            status === "PAID"
              ? "default"
              : status === "SELECTED"
              ? "secondary"
              : "outline"
          }
        >
          {status}
        </Badge>
      </div>
    </Card>
  );
}