"use client";

import { useState } from "react";

import type { AttendanceStatus } from "@/modules/attendance/attendance.helper";
import { AttendanceStatusBadge } from "src/components/attendance/AttendanceStatusBadge";

export interface ClassAttendanceStudent {
  id: string;
  name: string;
  registrationNumber: string;
  status?: AttendanceStatus;
  remarks?: string | null;
}

interface ClassAttendanceTableProps {
  students: ClassAttendanceStudent[];

  loading?: boolean;

  onSubmit?: (
    records: {
      studentId: string;
      status: AttendanceStatus;
      remarks?: string;
    }[],
  ) => void;
}

export function ClassAttendanceTable({
  students,
  loading = false,
  onSubmit,
}: ClassAttendanceTableProps) {
  const [records, setRecords] = useState<
    Record<string, AttendanceStatus>
  >(
    Object.fromEntries(
      students.map((student) => [
        student.id,
        student.status ?? "PRESENT",
      ]),
    ),
  );

  const [remarks, setRemarks] = useState<
    Record<string, string>
  >({});

  function updateStatus(
    studentId: string,
    status: AttendanceStatus,
  ) {
    setRecords((current) => ({
      ...current,
      [studentId]: status,
    }));
  }

  function updateRemarks(
    studentId: string,
    value: string,
  ) {
    setRemarks((current) => ({
      ...current,
      [studentId]: value,
    }));
  }

  function markAll(
    status: AttendanceStatus,
  ) {
    setRecords(
      Object.fromEntries(
        students.map((student) => [
          student.id,
          status,
        ]),
      ),
    );
  }

  function handleSubmit() {
    onSubmit?.(
      students.map((student) => ({
        studentId: student.id,

        status:
          records[student.id] ??
          "PRESENT",

        remarks:
          remarks[student.id]?.trim() ||
          undefined,
      })),
    );
  }

  const presentCount =
    students.filter(
      (student) =>
        records[student.id] ===
          "PRESENT" ||
        records[student.id] ===
          "LATE",
    ).length;

  const absentCount =
    students.filter(
      (student) =>
        records[student.id] ===
        "ABSENT",
    ).length;

  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold">
            Class Attendance
          </h2>

          <p className="text-sm text-muted-foreground">
            Verify student presence during the
            actual class.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              markAll("PRESENT")
            }
            className="rounded-md border bg-white px-3 py-1.5 text-xs font-medium hover:bg-gray-100"
          >
            Mark All Present
          </button>

          <button
            type="button"
            onClick={() =>
              markAll("ABSENT")
            }
            className="rounded-md border bg-white px-3 py-1.5 text-xs font-medium hover:bg-gray-100"
          >
            Mark All Absent
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 border-b sm:grid-cols-4">
        <SummaryItem
          label="Students"
          value={students.length}
        />

        <SummaryItem
          label="Present"
          value={presentCount}
        />

        <SummaryItem
          label="Absent"
          value={absentCount}
        />

        <SummaryItem
          label="Unmarked"
          value={
            Math.max(
              students.length -
                presentCount -
                absentCount,
              0,
            )
          }
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b">
            <tr>
              <th className="px-4 py-3 text-left font-medium">
                #
              </th>

              <th className="px-4 py-3 text-left font-medium">
                Student
              </th>

              <th className="px-4 py-3 text-left font-medium">
                Registration No.
              </th>

              <th className="px-4 py-3 text-left font-medium">
                Attendance
              </th>

              <th className="px-4 py-3 text-left font-medium">
                Remarks
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {students.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  No students found for this
                  class.
                </td>
              </tr>
            ) : (
              students.map(
                (student, index) => {
                  const status =
                    records[student.id] ??
                    "PRESENT";

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 text-muted-foreground">
                        {index + 1}
                      </td>

                      <td className="px-4 py-3 font-medium">
                        {student.name}
                      </td>

                      <td className="px-4 py-3">
                        {
                          student.registrationNumber
                        }
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          {(
                            [
                              "PRESENT",
                              "ABSENT",
                              "LATE",
                              "EXCUSED",
                            ] as AttendanceStatus[]
                          ).map(
                            (option) => (
                              <button
                                key={option}
                                type="button"
                                onClick={() =>
                                  updateStatus(
                                    student.id,
                                    option,
                                  )
                                }
                                className={`rounded-md border px-3 py-1.5 text-xs font-medium transition ${
                                  status ===
                                  option
                                    ? "border-black bg-black text-white"
                                    : "bg-white hover:bg-gray-100"
                                }`}
                              >
                                {formatStatus(
                                  option,
                                )}
                              </button>
                            ),
                          )}
                        </div>

                        <div className="mt-2">
                          <AttendanceStatusBadge
                            status={status}
                          />
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <input
                          value={
                            remarks[
                              student.id
                            ] ?? ""
                          }
                          onChange={(event) =>
                            updateRemarks(
                              student.id,
                              event.target.value,
                            )
                          }
                          placeholder="Optional"
                          className="w-full min-w-45 rounded-md border px-3 py-2 outline-none focus:ring-2"
                        />
                      </td>
                    </tr>
                  );
                },
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {students.length > 0 && (
        <div className="flex flex-col gap-3 border-t bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Class attendance will be stored with
            <span className="font-medium text-gray-900">
              {" "}
              CLASS
            </span>{" "}
            as its attendance source.
          </p>

          <button
            type="button"
            disabled={
              loading ||
              !onSubmit
            }
            onClick={handleSubmit}
            className="rounded-md bg-black px-5 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : "Save Class Attendance"}
          </button>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Summary                                                                    */
/* -------------------------------------------------------------------------- */

function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="border-r px-4 py-3 last:border-r-0">
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-lg font-semibold">
        {value}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function formatStatus(
  status: AttendanceStatus,
): string {
  return (
    status.charAt(0) +
    status
      .slice(1)
      .toLowerCase()
  );
}