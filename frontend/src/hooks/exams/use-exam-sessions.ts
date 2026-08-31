"use client";

import { useCallback, useEffect, useState } from "react";

export interface ExamSession {
  id: string;
  schoolId: string;

  name: string;
  code: string | null;
  academicYear: string | null;

  status: string;

  ruleSetId: string;

  startsAt: string | null;
  endsAt: string | null;

  createdAt: string;
  updatedAt: string;

  ruleSet?: {
    id: string;
    name: string;
    version: number;
    isActive: boolean;
  };
}

interface UseExamSessionsOptions {
  schoolId?: string;
}

export function useExamSessions(
  options: UseExamSessionsOptions = {},
) {
  const [sessions, setSessions] =
    useState<ExamSession[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const fetchSessions = useCallback(
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

        const query =
          params.toString();

        const response = await fetch(
          `/api/exams/sessions${
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
              "Failed to load examination sessions.",
          );
        }

        setSessions(
          data.sessions ?? data ?? [],
        );

        return data.sessions ?? data;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to load examination sessions.";

        setError(message);

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [options.schoolId],
  );

  const createSession = useCallback(
    async (input: {
      schoolId: string;
      name: string;
      code?: string;
      academicYear?: string;
      ruleSetId: string;
      startsAt?: string;
      endsAt?: string;
    }) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          "/api/exams/sessions",
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
              "Failed to create examination session.",
          );
        }

        await fetchSessions();

        return data;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to create examination session.";

        setError(message);

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchSessions],
  );

  const updateSession = useCallback(
    async (
      id: string,
      input: {
        name?: string;
        code?: string;
        academicYear?: string;
        ruleSetId?: string;
        startsAt?: string;
        endsAt?: string;
        status?: string;
      },
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/exams/sessions/${id}`,
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
              "Failed to update examination session.",
          );
        }

        await fetchSessions();

        return data;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to update examination session.";

        setError(message);

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchSessions],
  );

  const deleteSession = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/exams/sessions/${id}`,
          {
            method: "DELETE",
          },
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ??
              "Failed to delete examination session.",
          );
        }

        await fetchSessions();

        return data;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to delete examination session.";

        setError(message);

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchSessions],
  );

useEffect(() => {
  const timer = window.setTimeout(() => {
    void fetchSessions();
  }, 0);

  return () => {
    window.clearTimeout(timer);
  };
}, [fetchSessions]);
  return {
    sessions,

    loading,
    error,

    refresh: fetchSessions,

    createSession,
    updateSession,
    deleteSession,
  };
}