"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

interface VerificationResult {
  valid: boolean;
  certificateNumber?: string;
  certificateType?: string;
  studentName?: string;
  courseName?: string;
  issuedAt?: string | Date | null;
  message?: string;
}

interface CertificateVerificationProps {
  onVerify: (
    certificateNumber: string,
  ) => Promise<VerificationResult>;
}

export function CertificateVerification({
  onVerify,
}: CertificateVerificationProps) {
  const [number, setNumber] =
    useState("");

  const [result, setResult] =
    useState<VerificationResult | null>(
      null,
    );

  const [loading, setLoading] =
    useState(false);

  async function submit(
    event: FormEvent,
  ) {
    event.preventDefault();

    setLoading(true);
    setResult(null);

    try {
      const response =
        await onVerify(number.trim());

      setResult(response);
    } catch (error) {
      setResult({
        valid: false,
        message:
          error instanceof Error
            ? error.message
            : "Verification failed.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl rounded-xl border bg-white p-6">
      <div>
        <h2 className="text-xl font-semibold">
          Certificate Verification
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Enter the official certificate number
          to verify its authenticity.
        </p>
      </div>

      <form
        onSubmit={submit}
        className="mt-5 flex gap-2"
      >
        <input
          required
          value={number}
          onChange={(e) =>
            setNumber(e.target.value)
          }
          placeholder="Certificate number"
          className="min-w-0 flex-1 rounded-md border px-3 py-2"
        />

        <button
          disabled={loading}
          className="rounded-md bg-black px-4 py-2 text-white"
        >
          {loading
            ? "Checking..."
            : "Verify"}
        </button>
      </form>

      {result && (
        <div
          className={`mt-5 rounded-lg border p-4 ${
            result.valid
              ? "border-green-200 bg-green-50"
              : "border-red-200 bg-red-50"
          }`}
        >
          <div className="flex items-center gap-2">
            {result.valid ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}

            <span className="font-semibold">
              {result.valid
                ? "Certificate Verified"
                : "Certificate Not Found"}
            </span>
          </div>

          {result.valid && (
            <div className="mt-4 space-y-2 text-sm">
              <Info
                label="Certificate"
                value={
                  result.certificateNumber
                }
              />

              <Info
                label="Student"
                value={result.studentName}
              />

              <Info
                label="Course"
                value={result.courseName}
              />

              <Info
                label="Type"
                value={
                  result.certificateType
                }
              />

              <Info
                label="Issued"
                value={
                  result.issuedAt
                    ? new Date(
                        result.issuedAt,
                      ).toLocaleDateString()
                    : "—"
                }
              />
            </div>
          )}

          {!result.valid &&
            result.message && (
              <p className="mt-2 text-sm text-red-700">
                {result.message}
              </p>
            )}
        </div>
      )}
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">
        {label}
      </span>

      <span className="font-medium">
        {value ?? "—"}
      </span>
    </div>
  );
}