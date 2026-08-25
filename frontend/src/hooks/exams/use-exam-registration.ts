"use client";

import { useCallback, useState } from "react";

interface RegisterExamInput {
  sessionId: string;
  examId: string;
  studentId: string;
  admissionId?: string;
}

export function useExamRegistration() {
  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const register = useCallback(
    async (
      input: RegisterExamInput,
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          "/api/exams/registrations",
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
              "Failed to register examination.",
          );
        }

        return data;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to register examination.";

        setError(message);

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const registerStudentForSession =
    useCallback(
      async ({
        sessionId,
        studentId,
        admissionId,
      }: {
        sessionId: string;
        studentId: string;
        admissionId?: string;
      }) => {
        setLoading(true);
        setError(null);

        try {
          const response =
            await fetch(
              "/api/exams/registrations/session",
              {
                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json",
                },

                body: JSON.stringify({
                  sessionId,
                  studentId,
                  admissionId,
                }),
              },
            );

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data?.message ??
                "Failed to register student.",
            );
          }

          return data;
        } catch (err) {
          const message =
            err instanceof Error
              ? err.message
              : "Failed to register student.";

          setError(message);

          throw err;
        } finally {
          setLoading(false);
        }
      },
      [],
    );

  return {
    register,
    registerStudentForSession,

    loading,
    error,
  };
}