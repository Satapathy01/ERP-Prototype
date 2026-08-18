"use client";

import { useEffect, useState } from "react";

interface FinanceDashboard {
  totalCollection: number;
  todayCollection: number;
  monthlyCollection: number;
  pendingAmount: number;
}

export function useFinanceDashboard() {
  const [data, setData] = useState<FinanceDashboard>({
    totalCollection: 0,
    todayCollection: 0,
    monthlyCollection: 0,
    pendingAmount: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetch("/api/finance/dashboard");

        const json = await res.json();

        if (json.success) {
          setData(json.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return {
    data,
    loading,
  };
}