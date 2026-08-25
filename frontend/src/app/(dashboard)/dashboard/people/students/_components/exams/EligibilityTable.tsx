"use client";

import { EligibilityBadge } from "./EligibilityBadge";

export interface EligibilityRow {
  id: string;
  studentId: string;
  studentName?: string;
  admissionId?: string | null;
  status: string;
  ruleVersion: number;
  evaluatedAt?: string | Date | null;
}

interface EligibilityTableProps {
  data: EligibilityRow[];
  loading?: boolean;
  onSelect?: (item: EligibilityRow) => void;
}

export function EligibilityTable({
  data,
  loading = false,
  onSelect,
}: EligibilityTableProps) {
  if (loading) {
    return (
      <div className="rounded-lg border bg-white p-6 text-center text-sm text-muted-foreground">
        Loading eligibility...
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center text-sm text-muted-foreground">
        No eligibility records found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-white">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left font-medium">
              Student
            </th>

            <th className="px-4 py-3 text-left font-medium">
              Status
            </th>

            <th className="px-4 py-3 text-left font-medium">
              Rule Version
            </th>

            <th className="px-4 py-3 text-left font-medium">
              Evaluated
            </th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {data.map((item) => (
            <tr
              key={item.id}
              onClick={() => onSelect?.(item)}
              className={
                onSelect
                  ? "cursor-pointer hover:bg-muted/30"
                  : undefined
              }
            >
              <td className="px-4 py-3">
                <div className="font-medium">
                  {item.studentName ??
                    item.studentId}
                </div>

                {item.admissionId && (
                  <div className="text-xs text-muted-foreground">
                    Admission: {item.admissionId}
                  </div>
                )}
              </td>

              <td className="px-4 py-3">
                <EligibilityBadge
                  status={item.status}
                />
              </td>

              <td className="px-4 py-3">
                v{item.ruleVersion}
              </td>

              <td className="px-4 py-3 text-muted-foreground">
                {item.evaluatedAt
                  ? new Date(
                      item.evaluatedAt,
                    ).toLocaleString()
                  : "Not evaluated"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}