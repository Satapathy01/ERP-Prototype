"use client";

import { useCallback, useState } from "react";

import type {
  CourseAttendanceResult,
} from "@/modules/exams/eligibility/eligibility.types";

interface EvaluateEligibilityInput {
  studentId: string;
  sessionId: string;
  admissionId?: string;
  courseAttendance: CourseAttendanceResult[];
}

interface EligibilityResponse {
  eligibility: {
    id: string;
    status: string;
    ruleSetId: string;
    ruleVersion: number;
    evaluation: unknown;
  };

  evaluation: {
    eligible: boolean;
    reasons: string[];
  };

  payment: {
    totalAmount: number;
    totalPaid: number;
    percentage: number;
  };

  attendance: CourseAttendanceResult[];

  exams: {
    theoryPassed: boolean;
    practicalPassed: boolean;
  };

  ruleSet: {
    id: string;
    version: number;
  };
}

export function useExamEligibility() {
  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [result, setResult] =
    useState<EligibilityResponse | null>(
      null,
    );

  const evaluate = useCallback(
    async (
      input: EvaluateEligibilityInput,
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          "/api/exams/eligibility",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(input),
          },
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ??
              "Failed to evaluate eligibility.",
          );
        }

        setResult(data);

        return data as EligibilityResponse;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to evaluate eligibility.";

        setError(message);

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    evaluate,
    reset,

    loading,
    error,
    result,

    eligible:
      result?.evaluation
        ?.eligible ?? false,
  };
}