"use client";

import {
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface GraduationCardProps {
  graduated: boolean;
  certificateEligible: boolean;
  certificateFee: number;
  reasons: string[];
  loading?: boolean;
  onCreateCertificate?: () => void;
}

export function GraduationCard({
  graduated,
  certificateEligible,
  certificateFee,
  reasons,
  loading = false,
  onCreateCertificate,
}: GraduationCardProps) {
  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="flex items-start gap-4">
        {graduated ? (
          <CheckCircle2 className="mt-1 h-7 w-7 text-green-600" />
        ) : (
          <XCircle className="mt-1 h-7 w-7 text-red-600" />
        )}

        <div className="flex-1">
          <h2 className="text-xl font-semibold">
            {graduated
              ? "Graduation Requirements Completed"
              : "Graduation Requirements Not Completed"}
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {graduated
              ? "The student has completed the examination requirements."
              : "The student still has outstanding examination requirements."}
          </p>
        </div>
      </div>

      {reasons.length > 0 && (
        <div className="mt-5 rounded-lg bg-red-50 p-4">
          <h3 className="text-sm font-semibold text-red-700">
            Outstanding Requirements
          </h3>

          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-700">
            {reasons.map((reason, index) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>
        </div>
      )}

      {certificateEligible && (
        <div className="mt-5 rounded-lg border p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium">
                Certificate Eligible
              </p>

              <p className="text-sm text-muted-foreground">
                Certificate fee: ₹
                {certificateFee.toLocaleString(
                  "en-IN",
                )}
              </p>
            </div>

            {onCreateCertificate && (
              <button
                type="button"
                onClick={onCreateCertificate}
                disabled={loading}
                className="rounded-md bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
              >
                {loading
                  ? "Creating..."
                  : "Create Certificate"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}