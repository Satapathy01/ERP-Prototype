"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeletePaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  paymentId?: string;
  receiptNumber?: string | null;

  onDelete: (id: string) => Promise<void>;
}

export default function DeletePaymentDialog({
  open,
  onOpenChange,
  paymentId,
  receiptNumber,
  onDelete,
}: DeletePaymentDialogProps) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!paymentId) return;

    try {
      setLoading(true);

      await onDelete(paymentId);

      onOpenChange(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete Payment
          </AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete this fee payment
            {receiptNumber && (
              <>
                {" "}
                (<strong>{receiptNumber}</strong>)
              </>
            )}
            ?
            <br />
            <br />
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}