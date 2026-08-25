"use client";

interface EligibilityBadgeProps {
  status:
    | "PENDING"
    | "ELIGIBLE"
    | "NOT_ELIGIBLE"
    | string;
}

export function EligibilityBadge({
  status,
}: EligibilityBadgeProps) {
  const normalized = status.toUpperCase();

  const styles: Record<string, string> = {
    ELIGIBLE:
      "bg-green-100 text-green-700 border-green-200",

    NOT_ELIGIBLE:
      "bg-red-100 text-red-700 border-red-200",

    PENDING:
      "bg-yellow-100 text-yellow-700 border-yellow-200",
  };

  const labels: Record<string, string> = {
    ELIGIBLE: "Eligible",
    NOT_ELIGIBLE: "Not Eligible",
    PENDING: "Pending",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${
        styles[normalized] ??
        "bg-gray-100 text-gray-700 border-gray-200"
      }`}
    >
      {labels[normalized] ?? status}
    </span>
  );
}