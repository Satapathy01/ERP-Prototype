"use client";

import {
  Award,
  CheckCircle2,
  Clock,
  CreditCard,
  XCircle,
} from "lucide-react";

interface CertificateCardProps {
  certificate: {
    id: string;
    certificateNumber: string;
    certificateType: string;
    status: string;
    certificateFee: number;
    paymentId?: string | null;
    readyAt?: string | Date | null;
    issuedAt?: string | Date | null;
  };

  onPay?: () => void;
  onIssue?: () => void;
  onCancel?: () => void;
  onVerify?: () => void;
  loading?: boolean;
}

export function CertificateCard({
  certificate,
  onPay,
  onIssue,
  onCancel,
  onVerify,
  loading = false,
}: CertificateCardProps) {
  const status = certificate.status;

  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-muted p-2">
            <Award className="h-6 w-6" />
          </div>

          <div>
            <h3 className="font-semibold">
              {certificate.certificateType}
            </h3>

            <p className="text-sm text-muted-foreground">
              {certificate.certificateNumber}
            </p>
          </div>
        </div>

        <Status status={status} />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Info
          label="Certificate Fee"
          value={`₹${certificate.certificateFee.toLocaleString(
            "en-IN",
          )}`}
        />

        <Info
          label="Payment"
          value={
            certificate.paymentId
              ? "Paid"
              : "Pending"
          }
        />

        <Info
          label="Issued"
          value={
            certificate.issuedAt
              ? new Date(
                  certificate.issuedAt,
                ).toLocaleDateString()
              : "Not issued"
          }
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {!certificate.paymentId &&
          onPay && (
            <button
              type="button"
              onClick={onPay}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm text-white"
            >
              <CreditCard className="h-4 w-4" />
              Pay Certificate Fee
            </button>
          )}

        {status ===
          "READY_FOR_COLLECTION" &&
          onIssue && (
            <button
              type="button"
              onClick={onIssue}
              disabled={loading}
              className="rounded-md bg-green-600 px-4 py-2 text-sm text-white"
            >
              Issue Certificate
            </button>
          )}

        {onVerify && (
          <button
            type="button"
            onClick={onVerify}
            className="rounded-md border px-4 py-2 text-sm"
          >
            Verify
          </button>
        )}

        {status !== "ISSUED" &&
          status !== "CANCELLED" &&
          onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border border-red-200 px-4 py-2 text-sm text-red-600"
            >
              Cancel
            </button>
          )}
      </div>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 font-medium">
        {value}
      </p>
    </div>
  );
}

function Status({
  status,
}: {
  status: string;
}) {
  const icon =
    status === "ISSUED" ? (
      <CheckCircle2 className="h-4 w-4" />
    ) : status === "CANCELLED" ? (
      <XCircle className="h-4 w-4" />
    ) : (
      <Clock className="h-4 w-4" />
    );

  return (
    <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs">
      {icon}
      {status.replaceAll("_", " ")}
    </span>
  );
}