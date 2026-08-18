"use client";

export interface ReceiptHistoryItem {
  id: string;
  receiptNo: string;
  mrNo: string;
  studentName: string;
  registrationNo: string;
  course: string;
  amount: number;
  paymentMethod: string;
  paymentDate: Date;
  collectedBy: string;
  status: "PAID" | "REFUNDED";
}

interface ReceiptHistoryProps {
  receipts: ReceiptHistoryItem[];
  loading?: boolean;
  onView: (id: string) => void;
  onPrint: (id: string) => void;
  onDownload: (id: string) => void;
  onRefund?: (id: string) => void;
}

export default function ReceiptHistory({
  receipts,
}: ReceiptHistoryProps) {
  return (
    <div>
      Receipt History ({receipts.length})
    </div>
  );
}