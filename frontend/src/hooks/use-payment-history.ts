import { useQuery } from "@tanstack/react-query";

export function usePaymentHistory(admissionId?: string) {
  return useQuery({
    queryKey: ["payment-history", admissionId],

    enabled: !!admissionId,

    queryFn: async () => {
      const res = await fetch(
        `/api/finance/payments/history/${admissionId}`
      );

      if (!res.ok) {
        throw new Error("Failed to load payment history");
      }

      return res.json();
    },
  });
}