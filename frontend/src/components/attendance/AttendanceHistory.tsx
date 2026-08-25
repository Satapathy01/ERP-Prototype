"use client";

import { AttendanceStatusBadge } from "./AttendanceStatusBadge";

import type { AttendanceStatus } from "@/modules/attendance/attendance.helper";

export interface AttendanceHistoryRecord {
  id: string;

  studentName: string;

  registrationNumber: string;

  date: string;

  status: AttendanceStatus;

  source:
    | "MANUAL"
    | "CLASS"
    | "CAMPUS_SCAN";

  courseName?: string | null;

  batchName?: string | null;

  remarks?: string | null;
}

interface AttendanceHistoryProps {
  records: AttendanceHistoryRecord[];
}

export function AttendanceHistory({
  records,
}: AttendanceHistoryProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">
                Date
              </th>

              <th className="px-4 py-3 text-left font-medium">
                Student
              </th>

              <th className="px-4 py-3 text-left font-medium">
                Registration No.
              </th>

              <th className="px-4 py-3 text-left font-medium">
                Course
              </th>

              <th className="px-4 py-3 text-left font-medium">
                Source
              </th>

              <th className="px-4 py-3 text-left font-medium">
                Status
              </th>

              <th className="px-4 py-3 text-left font-medium">
                Remarks
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {records.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  No attendance records found.
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr
                  key={record.id}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    {new Date(
                      record.date,
                    ).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3 font-medium">
                    {record.studentName}
                  </td>

                  <td className="px-4 py-3">
                    {
                      record.registrationNumber
                    }
                  </td>

                  <td className="px-4 py-3">
                    {record.courseName ??
                      "—"}
                  </td>

                  <td className="px-4 py-3">
                    <SourceBadge
                      source={record.source}
                    />
                  </td>

                  <td className="px-4 py-3">
                    <AttendanceStatusBadge
                      status={record.status}
                    />
                  </td>

                  <td className="max-w-60 px-4 py-3 text-muted-foreground">
                    {record.remarks ??
                      "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SourceBadge({
  source,
}: {
  source:
    | "MANUAL"
    | "CLASS"
    | "CAMPUS_SCAN";
}) {
  const config = {
    MANUAL: {
      label: "Manual",
      className:
        "bg-gray-100 text-gray-700",
    },

    CLASS: {
      label: "Class",
      className:
        "bg-blue-50 text-blue-700",
    },

    CAMPUS_SCAN: {
      label: "Campus Scan",
      className:
        "bg-emerald-50 text-emerald-700",
    },
  } as const;

  const item = config[source];

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${item.className}`}
    >
      {item.label}
    </span>
  );
}