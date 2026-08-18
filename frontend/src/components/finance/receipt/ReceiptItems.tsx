"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";

export interface ReceiptItem {
  id: string;
  title: string;
  amount: number;
}

interface ReceiptItemsProps {
  items: ReceiptItem[];
}

export default function ReceiptItems({
  items,
}: ReceiptItemsProps) {
  const total = items.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  return (
    <div className="space-y-3">

      <h3 className="font-semibold">
        Fee Details
      </h3>

      <Table>

        <TableBody>

          {items.map((item) => (
            <TableRow key={item.id}>

              <TableCell>
                {item.title}
              </TableCell>

              <TableCell className="text-right">
                ₹{item.amount.toLocaleString("en-IN")}
              </TableCell>

            </TableRow>
          ))}

          <TableRow className="font-bold">

            <TableCell>
              Total
            </TableCell>

            <TableCell className="text-right">
              ₹{total.toLocaleString("en-IN")}
            </TableCell>

          </TableRow>

        </TableBody>

      </Table>

    </div>
  );
}