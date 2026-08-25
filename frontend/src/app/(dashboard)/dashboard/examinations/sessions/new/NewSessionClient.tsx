"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { ExamSessionForm } from "@/app/(dashboard)/dashboard/people/students/_components/exams/ExamSessionForm";

import { createExamSession } from "@/modules/exams/sessions/create-exam-session";

interface RuleSetOption {
  id: string;
  name: string;
  version: number;
  description?: string | null;
  isActive: boolean;
}

interface NewSessionClientProps {
  schoolId: string;
  ruleSets: RuleSetOption[];
}

export function NewSessionClient({
  schoolId,
  ruleSets,
}: NewSessionClientProps) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function handleSubmit(values: {
    name: string;
    code?: string;
    academicYear?: string;
    ruleSetId: string;
    startsAt?: string;
    endsAt?: string;
  }) {
    setLoading(true);
    setError(null);

    try {
      const result =
        await createExamSession(
          schoolId,
          values,
        );

      if (!result.success) {
        setError(result.message);
        return;
      }

      router.push(
        "/dashboard/examinations/sessions",
      );

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create examination session.",
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

      <ExamSessionForm
        ruleSets={ruleSets}
        loading={loading}
        onSubmit={handleSubmit}
        onCancel={() =>
          router.push(
            "/dashboard/examinations/sessions",
          )
        }
      />
    </div>
  );
}