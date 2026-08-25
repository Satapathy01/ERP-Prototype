"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  ExamForm,
  type ExamFormValues,
} from "@/app/(dashboard)/dashboard/people/students/_components/exams/ExamForm";

interface CourseOption {
  id: string;
  name: string;
  code?: string;
}

interface NewExamClientProps {
  sessionId: string;
  courses: CourseOption[];
}

export function NewExamClient({
  sessionId,
  courses,
}: NewExamClientProps) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function handleSubmit(
    values: ExamFormValues,
  ) {
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

          body: JSON.stringify({
            sessionId: values.sessionId,
            courseId: values.courseId,

            name: values.name,

            code:
              values.code || undefined,

            type: values.type,

            maxMarks: values.maxMarks,

            passMarks: values.passMarks,

            examDate:
              values.examDate ||
              undefined,

            startTime:
              values.startTime ||
              undefined,

            endTime:
              values.endTime ||
              undefined,

            venue:
              values.venue ||
              undefined,

            instructions:
              values.instructions ||
              undefined,
          }),
        },
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Failed to create examination.",
        );
      }

      router.push(
        `/dashboard/examinations/exams?sessionId=${sessionId}`,
      );

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create examination.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <ExamForm
        sessionId={sessionId}
        courses={courses}
        loading={loading}
        onSubmit={handleSubmit}
      />
    </div>
  );
}