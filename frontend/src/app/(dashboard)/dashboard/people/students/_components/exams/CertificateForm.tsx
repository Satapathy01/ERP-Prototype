"use client";

import { FormEvent, useState } from "react";

interface CertificateFormProps {
  studentName?: string;
  sessionName?: string;
  defaultFee: number;
  loading?: boolean;

  onSubmit: (values: {
    certificateNumber: string;
    certificateType: string;
    certificateFee: number;
  }) => void;
}

export function CertificateForm({
  studentName,
  sessionName,
  defaultFee,
  loading = false,
  onSubmit,
}: CertificateFormProps) {
  const [certificateNumber, setCertificateNumber] =
    useState("");

  const [certificateType, setCertificateType] =
    useState("COURSE_COMPLETION");

  const [certificateFee, setCertificateFee] =
    useState(defaultFee.toString());

  function submit(
    event: FormEvent,
  ) {
    event.preventDefault();

    onSubmit({
      certificateNumber:
        certificateNumber.trim(),

      certificateType,

      certificateFee:
        Number(certificateFee),
    });
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-5 rounded-xl border bg-white p-6"
    >
      <div>
        <h2 className="text-lg font-semibold">
          Generate Certificate
        </h2>

        {(studentName ||
          sessionName) && (
          <p className="mt-1 text-sm text-muted-foreground">
            {studentName}
            {studentName &&
              sessionName &&
              " • "}
            {sessionName}
          </p>
        )}
      </div>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium">
          Certificate Number
        </span>

        <input
          required
          value={certificateNumber}
          onChange={(e) =>
            setCertificateNumber(
              e.target.value,
            )
          }
          placeholder="CERT-2026-0001"
          className="w-full rounded-md border px-3 py-2"
        />
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium">
          Certificate Type
        </span>

        <select
          value={certificateType}
          onChange={(e) =>
            setCertificateType(
              e.target.value,
            )
          }
          className="w-full rounded-md border px-3 py-2"
        >
          <option value="COURSE_COMPLETION">
            Course Completion
          </option>

          <option value="DIPLOMA">
            Diploma
          </option>

          <option value="OTHER">
            Other
          </option>
        </select>
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium">
          Certificate Fee
        </span>

        <input
          type="number"
          min={0}
          step="0.01"
          required
          value={certificateFee}
          onChange={(e) =>
            setCertificateFee(
              e.target.value,
            )
          }
          className="w-full rounded-md border px-3 py-2"
        />
      </label>

      <button
        disabled={loading}
        className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {loading
          ? "Creating..."
          : "Generate Certificate"}
      </button>
    </form>
  );
}