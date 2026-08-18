"use client";

interface ReceiptFooterProps {
  receiptNo: string;
  mrNo: string;
  paymentMethod: string;
  paymentDate: Date | string;
  collectedBy: string;
  thermal?: boolean;
}

export default function ReceiptFooter({
  receiptNo,
  mrNo,
  paymentMethod,
  paymentDate,
  collectedBy,
  thermal = false,
}: ReceiptFooterProps) {
  const formattedDate =
    typeof paymentDate === "string"
      ? paymentDate
      : paymentDate.toLocaleDateString("en-IN");

  if (thermal) {
    return (
      <div className="mt-4 space-y-1 border-t border-dashed pt-3 text-[11px]">
        <div className="flex justify-between">
          <span>Receipt No</span>
          <span>{receiptNo}</span>
        </div>

        <div className="flex justify-between">
          <span>MR No</span>
          <span>{mrNo}</span>
        </div>

        <div className="flex justify-between">
          <span>Method</span>
          <span>{paymentMethod}</span>
        </div>

        <div className="flex justify-between">
          <span>Date</span>
          <span>{formattedDate}</span>
        </div>

        <div className="flex justify-between">
          <span>Collected By</span>
          <span>{collectedBy}</span>
        </div>

        <div className="border-t border-dashed pt-2 text-center">
          Thank you for your payment
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 border-t pt-6">
      <div className="grid grid-cols-2 gap-6 text-sm">

        <div className="space-y-2">
          <div>
            <strong>Receipt No:</strong> {receiptNo}
          </div>

          <div>
            <strong>MR No:</strong> {mrNo}
          </div>

          <div>
            <strong>Payment Method:</strong> {paymentMethod}
          </div>

          <div>
            <strong>Payment Date:</strong> {formattedDate}
          </div>

          <div>
            <strong>Collected By:</strong> {collectedBy}
          </div>
        </div>

        <div className="flex justify-between pt-10">
          <div className="text-center">
            <div className="border-t w-36" />
            <p className="mt-2 text-xs">
              Student Signature
            </p>
          </div>

          <div className="text-center">
            <div className="border-t w-36" />
            <p className="mt-2 text-xs">
              Authorized Signature
            </p>
          </div>
        </div>

      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Thank you for choosing our institute.
      </p>
    </div>
  );
}