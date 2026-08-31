"use client";

import { useCallback, useEffect, useState } from "react";

export interface ExamRuleSet {
  id: string;
  schoolId: string;
  name: string;
  description: string | null;
  version: number;
  rules: Record<string, unknown>;
  isActive: boolean;
  effectiveFrom: string | null;
  effectiveUntil: string | null;
  createdAt: string;
  updatedAt: string;
}

interface UseExamRulesOptions {
  schoolId?: string;
  activeOnly?: boolean;
}

export function useExamRules(
  options: UseExamRulesOptions = {},
) {
  const [rules, setRules] = useState<
    ExamRuleSet[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const fetchRules = useCallback(
    async () => {
      setLoading(true);
      setError(null);

      try {
        const params =
          new URLSearchParams();

        if (options.schoolId) {
          params.set(
            "schoolId",
            options.schoolId,
          );
        }

        if (options.activeOnly) {
          params.set("active", "true");
        }

        const query =
          params.toString();

        const response = await fetch(
          `/api/exams/rules${
            query ? `?${query}` : ""
          }`,
          {
            method: "GET",
            cache: "no-store",
          },
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ??
              "Failed to load examination rules.",
          );
        }

        setRules(
          data.rules ?? data ?? [],
        );

        return data.rules ?? data;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to load examination rules.";

        setError(message);

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [options.schoolId, options.activeOnly],
  );

  const createRuleSet = useCallback(
    async (input: {
      schoolId: string;
      name: string;
      description?: string;
      rules: Record<string, unknown>;
      isActive?: boolean;
      effectiveFrom?: string;
      effectiveUntil?: string;
    }) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          "/api/exams/rules",
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
              "Failed to create examination rules.",
          );
        }

        await fetchRules();

        return data;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to create examination rules.";

        setError(message);

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchRules],
  );

  const updateRuleSet = useCallback(
    async (
      id: string,
      input: {
        name?: string;
        description?: string;
        rules?: Record<string, unknown>;
        isActive?: boolean;
        effectiveFrom?: string;
        effectiveUntil?: string;
      },
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/exams/rules/${id}`,
          {
            method: "PUT",

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
              "Failed to update examination rules.",
          );
        }

        await fetchRules();

        return data;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to update examination rules.";

        setError(message);

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchRules],
  );

  const activateRuleSet =
    useCallback(
      async (id: string) => {
        return updateRuleSet(id, {
          isActive: true,
        });
      },
      [updateRuleSet],
    );

useEffect(() => {
  const timer = window.setTimeout(() => {
    void fetchRules();
  }, 0);

  return () => {
    window.clearTimeout(timer);
  };
}, [fetchRules]);

  return {
    rules,

    loading,
    error,

    refresh: fetchRules,

    createRuleSet,
    updateRuleSet,
    activateRuleSet,
  };
}