"use client";

import ReceiptHeader from "./ReceiptHeader";
import ReceiptItems, { ReceiptItem } from "./ReceiptItems";
import ReceiptFooter from "./ReceiptFooter";

interface StudentInfo {
  name: string;
  registrationNo: string;
  course: string;
}

interface ThermalReceiptProps {
  student: StudentInfo;

  receiptNo: string;
  mrNo: string;

  paymentDate: Date;

  paymentMethod: string;

  collectedBy: string;

  items: ReceiptItem[];

  paperWidth?: "58mm" | "80mm";
}

export default function ThermalReceipt({
  student,
  receiptNo,
  mrNo,
  paymentDate,
  paymentMethod,
  collectedBy,
  items,
  paperWidth = "80mm",
}: ThermalReceiptProps) {
  const width =
    paperWidth === "58mm"
      ? "w-[58mm]"
      : "w-[80mm]";

  return (
    <div
      className={`${width} mx-auto bg-white p-2 text-xs text-black`}
    >
      <ReceiptHeader thermal />

      <div className="mt-3 space-y-1">
        <div className="flex justify-between">
          <span>Name</span>
          <span>{student.name}</span>
        </div>

        <div className="flex justify-between">
          <span>Reg No</span>
          <span>{student.registrationNo}</span>
        </div>

        <div className="flex justify-between">
          <span>Course</span>
          <span>{student.course}</span>
        </div>
      </div>

      <div className="my-3 border-t border-dashed" />

      <ReceiptItems items={items} />

      <ReceiptFooter
        thermal
        receiptNo={receiptNo}
        mrNo={mrNo}
        paymentMethod={paymentMethod}
        paymentDate={paymentDate}
        collectedBy={collectedBy}
      />
    </div>
  );
}