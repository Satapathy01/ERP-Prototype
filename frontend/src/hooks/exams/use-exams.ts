"use client";

import { useCallback, useEffect, useState } from "react";

export interface Exam {
  id: string;

  sessionId: string;
  courseId: string;

  name: string;
  code: string | null;

  type: "THEORY" | "PRACTICAL" | string;

  status: string;

  maxMarks: number;
  passMarks: number;

  examDate: string | null;
  startTime: string | null;
  endTime: string | null;

  venue: string | null;
  instructions: string | null;

  createdAt: string;
  updatedAt: string;

  course?: {
    id: string;
    name: string;
    code: string;
  };
}

interface UseExamsOptions {
  sessionId?: string;
  courseId?: string;
}

export function useExams(
  options: UseExamsOptions = {},
) {
  const [exams, setExams] =
    useState<Exam[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const fetchExams = useCallback(
    async () => {
      setLoading(true);
      setError(null);

      try {
        const params =
          new URLSearchParams();

        if (options.sessionId) {
          params.set(
            "sessionId",
            options.sessionId,
          );
        }

        if (options.courseId) {
          params.set(
            "courseId",
            options.courseId,
          );
        }

        const query =
          params.toString();

        const response = await fetch(
          `/api/exams${
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
              "Failed to load examinations.",
          );
        }

        setExams(
          data.exams ?? data ?? [],
        );

        return data.exams ?? data;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to load examinations.";

        setError(message);

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [
      options.sessionId,
      options.courseId,
    ],
  );

  const createExam = useCallback(
    async (input: {
      sessionId: string;
      courseId: string;

      name: string;
      code?: string;

      type:
        | "THEORY"
        | "PRACTICAL";

      maxMarks: number;
      passMarks: number;

      examDate?: string;
      startTime?: string;
      endTime?: string;

      venue?: string;
      instructions?: string;
    }) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          "/api/exams",
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
              "Failed to create examination.",
          );
        }

        await fetchExams();

        return data;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to create examination.";

        setError(message);

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchExams],
  );

  const updateExam = useCallback(
    async (
      id: string,
      input: {
        name?: string;
        code?: string;

        type?:
          | "THEORY"
          | "PRACTICAL";

        maxMarks?: number;
        passMarks?: number;

        examDate?: string;
        startTime?: string;
        endTime?: string;

        venue?: string;
        instructions?: string;

        status?: string;
      },
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/exams/${id}`,
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
              "Failed to update examination.",
          );
        }

        await fetchExams();

        return data;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to update examination.";

        setError(message);

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchExams],
  );

  const deleteExam = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/exams/${id}`,
          {
            method: "DELETE",
          },
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ??
              "Failed to delete examination.",
          );
        }

        await fetchExams();

        return data;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to delete examination.";

        setError(message);

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchExams],
  );

useEffect(() => {
  const timer = window.setTimeout(() => {
    void fetchExams();
  }, 0);

  return () => {
    window.clearTimeout(timer);
  };
}, [fetchExams]);
  return {
    exams,

    loading,
    error,

    refresh: fetchExams,

    createExam,
    updateExam,
    deleteExam,
  };
}