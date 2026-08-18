"use client";

import type { Prisma } from "@prisma/client";

import ReceiptHeader from "./ReceiptHeader";
import ReceiptFooter from "./ReceiptFooter";
import ReceiptItems, {
  type ReceiptItem,
} from "./ReceiptItems";

type PaymentReceiptData = Prisma.FeePaymentGetPayload<{
  include: {
    admission: {
      include: {
        student: true;
        course: true;
      };
    };
  };
}>;

interface PaymentReceiptProps {
  payment: PaymentReceiptData;
}

export default function PaymentReceipt({
  payment,
}: PaymentReceiptProps) {
  const items: ReceiptItem[] = [
    {
      id: payment.id,
      title: payment.admission.course.name,
      amount: Number(payment.amountPaid),
    },
  ];

  return (
    <div className="mx-auto max-w-4xl rounded-lg bg-white p-8 text-black shadow">

      <ReceiptHeader />

      {/* Student Details */}

      <div className="mt-6 grid grid-cols-2 gap-4 text-sm">

        <div>
          <strong>Name:</strong>{" "}
          {payment.admission.student.name}
        </div>

        <div>
          <strong>Registration No:</strong>{" "}
          {payment.admission.student.registrationNumber}
        </div>

        <div>
          <strong>Admission ID:</strong>{" "}
          {payment.admission.id}
        </div>

        <div>
          <strong>Course:</strong>{" "}
          {payment.admission.course.name}
        </div>

        <div>
          <strong>Admission Date:</strong>{" "}
          {payment.admission.admissionDate.toLocaleDateString()}
        </div>

        <div>
          <strong>Status:</strong>{" "}
          {payment.status}
        </div>

      </div>

      <div className="my-6 border-t" />

      <ReceiptItems items={items} />

      <ReceiptFooter
        receiptNo={payment.receiptNumber ?? "-"}
        mrNo={payment.mrNumber ?? "-"}
        paymentMethod={payment.paymentMethod}
        paymentDate={
          payment.receiptDate ??
          payment.createdAt
        }
        collectedBy={
          payment.collectedBy ?? "-"
        }
      />
    </div>
  );
}