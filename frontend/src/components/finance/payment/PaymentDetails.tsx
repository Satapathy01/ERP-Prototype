"use client";

import { UseFormReturn } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface PaymentDetailsForm {
  paymentMethod: string;
  transactionId?: string;
  collectedBy: string;
  remarks?: string;
}

interface PaymentDetailsProps {
  form: UseFormReturn<PaymentDetailsForm>;
}

export default function PaymentDetails({
  form,
}: PaymentDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-6 md:grid-cols-2">

        {/* Payment Method */}

        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Method</FormLabel>

              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  <SelectItem value="CASH">
                    Cash
                  </SelectItem>

                  <SelectItem value="UPI">
                    UPI
                  </SelectItem>

                  <SelectItem value="CARD">
                    Card
                  </SelectItem>

                  <SelectItem value="BANK_TRANSFER">
                    Bank Transfer
                  </SelectItem>

                  <SelectItem value="CHEQUE">
                    Cheque
                  </SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Collected By */}

        <FormField
          control={form.control}
          name="collectedBy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Collected By</FormLabel>

              <FormControl>
                <Input
                  placeholder="Staff Name"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Transaction */}

        <FormField
          control={form.control}
          name="transactionId"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>
                Transaction ID
              </FormLabel>

              <FormControl>
                <Input
                  placeholder="Optional"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Remarks */}

        <FormField
          control={form.control}
          name="remarks"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Remarks</FormLabel>

              <FormControl>
                <Textarea
                  rows={3}
                  placeholder="Optional remarks..."
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

      </CardContent>
    </Card>
  );
}