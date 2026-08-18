"use client";

import { useState } from "react";

import type { Prisma } from "@prisma/client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";

import {
  Printer,
  Download,
  X,
} from "lucide-react";

import PaymentReceipt from "./PaymentReceipt";
import ThermalReceipt from "./ThermalReceipt";

type PaymentReceiptData =
  Prisma.FeePaymentGetPayload<{
    include: {
      admission: {
        include: {
          student: true;
          course: true;
        };
      };
    };
  }>;

interface ReceiptPreviewProps {
  open: boolean;

  onOpenChange: (open: boolean) => void;

  payment: PaymentReceiptData;

  onPrint: (
    format: "A4" | "58mm" | "80mm"
  ) => void;

  onDownloadPdf?: () => void;
}

export default function ReceiptPreview({
  open,
  onOpenChange,
  payment,
  onPrint,
  onDownloadPdf,
}: ReceiptPreviewProps) {
  const [format, setFormat] = useState<
    "A4" | "58mm" | "80mm"
  >("A4");

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[90vh] max-w-5xl overflow-auto">

        <DialogHeader>
          <DialogTitle>
            Receipt Preview
          </DialogTitle>
        </DialogHeader>

        <Tabs
          value={format}
          onValueChange={(value) =>
            setFormat(value as typeof format)
          }
        >
          <TabsList>
            <TabsTrigger value="A4">
              A4
            </TabsTrigger>

            <TabsTrigger value="58mm">
              Thermal 58mm
            </TabsTrigger>

            <TabsTrigger value="80mm">
              Thermal 80mm
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mt-6 rounded-lg border bg-muted/30 p-6">

          {format === "A4" && (
            <PaymentReceipt payment={payment} />
          )}

          {(format === "58mm" ||
            format === "80mm") && (
            <ThermalReceipt
              student={{
                name:
                  payment.admission.student.name,

                registrationNo:
                  payment.admission.student
                    .registrationNumber,

                course:
                  payment.admission.course.name,
              }}
              receiptNo={
                payment.receiptNumber ?? "-"
              }
              mrNo={payment.mrNumber ?? "-"}
              paymentDate={
                payment.receiptDate ??
                payment.createdAt
              }
              paymentMethod={String(
                payment.paymentMethod
              )}
              collectedBy={
                payment.collectedBy ?? "-"
              }
              items={[
                {
                  id: payment.id,
                  title:
                    payment.admission.course.name,
                  amount: Number(
                    payment.amountPaid
                  ),
                },
              ]}
              paperWidth={format}
            />
          )}

        </div>

        <div className="flex justify-end gap-3">

          <Button
            variant="outline"
            onClick={() =>
              onOpenChange(false)
            }
          >
            <X className="mr-2 h-4 w-4" />
            Close
          </Button>

          {onDownloadPdf && (
            <Button
              variant="secondary"
              onClick={onDownloadPdf}
            >
              <Download className="mr-2 h-4 w-4" />
              PDF
            </Button>
          )}

          <Button
            onClick={() =>
              onPrint(format)
            }
          >
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>

        </div>

      </DialogContent>
    </Dialog>
  );
}