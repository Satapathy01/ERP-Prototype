import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { PaymentReceipt } from "@/components/finance";
import { verifyToken } from "@/modules/auth/jwt";
import { getPaymentReceipt } from "@/modules/finance/services/server";

interface ReceiptPageProps {
  params: Promise<{
    paymentId: string;
  }>;
}

export default async function ReceiptPage({
  params,
}: ReceiptPageProps) {
  const { paymentId } = await params;

  const cookieStore = await cookies();

  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    redirect("/login");
  }

  const payload = await verifyToken(token);

  if (!payload) {
    redirect("/login");
  }

  const payment = await getPaymentReceipt(
    payload.schoolId,
    paymentId
  );

  if (!payment) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-muted/40 py-8">
      <div className="container mx-auto max-w-5xl px-4">
        <PaymentReceipt payment={payment} />
      </div>
    </main>
  );
}