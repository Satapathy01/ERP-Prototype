"use client";

import { useCallback, useState } from "react";

interface SaveResultInput {
  registrationId: string;
  marksObtained: number;
  remarks?: string;
}

export function useExamResults() {
  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const saveResult = useCallback(
    async (
      input: SaveResultInput,
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          "/api/exams/results",
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
              "Failed to save examination result.",
          );
        }

        return data;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to save examination result.";

        setError(message);

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const publishResult = useCallback(
    async (
      id: string,
      publishedBy?: string,
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/exams/results/${id}/publish`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              publishedBy,
            }),
          },
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ??
              "Failed to publish result.",
          );
        }

        return data;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to publish result.";

        setError(message);

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    saveResult,
    publishResult,

    loading,
    error,
  };
}