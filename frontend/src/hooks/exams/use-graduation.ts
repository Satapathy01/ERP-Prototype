"use client";

import { useCallback, useEffect, useState } from "react";

export interface GraduationExaminations {
  totalRequired: number;
  totalCompleted: number;
  totalPassed: number;
  theoryPassed: boolean;
  practicalPassed: boolean;
}

export interface GraduationResult {
  graduated: boolean;

  studentId: string;
  admissionId: string | null;
  sessionId: string;

  certificateEligible: boolean;
  certificateFee: number;

  reasons: string[];

  examinations: GraduationExaminations;
}

interface UseGraduationResult {
  graduation: GraduationResult | null;
  loading: boolean;
  error: string | null;
  evaluate: () => Promise<void>;
}

export function useGraduation(
  studentId?: string,
  sessionId?: string,
): UseGraduationResult {
  const [graduation, setGraduation] =
    useState<GraduationResult | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const evaluate = useCallback(async () => {
    if (!studentId || !sessionId) {
      setGraduation(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        studentId,
        sessionId,
      });

      const response = await fetch(
        `/api/exams/graduation?${params.toString()}`,
        {
          method: "GET",
          cache: "no-store",
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ??
            "Failed to evaluate graduation eligibility.",
        );
      }

      setGraduation(data.graduation);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to evaluate graduation eligibility.",
      );

      setGraduation(null);
    } finally {
      setLoading(false);
    }
  }, [studentId, sessionId]);

useEffect(() => {
  const timer = window.setTimeout(() => {
    void evaluate();
  }, 0);

  return () => {
    window.clearTimeout(timer);
  };
}, [evaluate]);
  return {
    graduation,
    loading,
    error,
    evaluate,
  };
}