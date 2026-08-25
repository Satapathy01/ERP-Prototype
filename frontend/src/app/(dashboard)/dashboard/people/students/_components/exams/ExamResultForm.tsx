"use client";

import { FormEvent, useState } from "react";

interface ExamResultFormProps {
  registrationId: string;
  maxMarks: number;
  loading?: boolean;
  onSubmit: (values: {
    registrationId: string;
    marksObtained: number;
    remarks?: string;
  }) => void;
}

export function ExamResultForm({
  registrationId,
  maxMarks,
  loading = false,
  onSubmit,
}: ExamResultFormProps) {
  const [marks, setMarks] =
    useState("");

  const [remarks, setRemarks] =
    useState("");

  function submit(
    event: FormEvent,
  ) {
    event.preventDefault();

    onSubmit({
      registrationId,
      marksObtained: Number(marks),
      remarks:
        remarks.trim() || undefined,
    });
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-4 rounded-xl border bg-white p-5"
    >
      <div>
        <h3 className="font-semibold">
          Enter Result
        </h3>

        <p className="text-xs text-muted-foreground">
          Maximum marks: {maxMarks}
        </p>
      </div>

      <label className="space-y-1.5 block">
        <span className="text-sm font-medium">
          Marks Obtained
        </span>

        <input
          type="number"
          min={0}
          max={maxMarks}
          step="0.01"
          required
          value={marks}
          onChange={(e) =>
            setMarks(e.target.value)
          }
          className="w-full rounded-md border px-3 py-2"
        />
      </label>

      <label className="space-y-1.5 block">
        <span className="text-sm font-medium">
          Remarks
        </span>

        <textarea
          rows={3}
          value={remarks}
          onChange={(e) =>
            setRemarks(e.target.value)
          }
          className="w-full rounded-md border px-3 py-2"
        />
      </label>

      <button
        disabled={loading}
        className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Result"}
      </button>
    </form>
  );
}