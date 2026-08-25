"use client";

import { useState } from "react";

import type { AttendanceStatus } from "@/modules/attendance/attendance.helper";

import { AttendanceStatusBadge } from "./AttendanceStatusBadge";

export interface AttendanceStudent {
  id: string;
  name: string;
  registrationNumber: string;
  status?: AttendanceStatus;
  remarks?: string | null;
}

interface ManualAttendanceTableProps {
  students: AttendanceStudent[];

  loading?: boolean;

  onSubmit?: (
    records: {
      studentId: string;
      status: AttendanceStatus;
      remarks?: string;
    }[],
  ) => void;
}

export function ManualAttendanceTable({
  students,
  loading = false,
  onSubmit,
}: ManualAttendanceTableProps) {
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

  function handleSubmit() {
    onSubmit?.(
      students.map((student) => ({
        studentId: student.id,
        status:
          records[student.id] ?? "PRESENT",
        remarks:
          remarks[student.id]?.trim() ||
          undefined,
      })),
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
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
                Status
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
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  No students found.
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
                                className={`rounded-md border px-2.5 py-1 text-xs ${
                                  status ===
                                  option
                                    ? "border-black bg-black text-white"
                                    : "bg-white hover:bg-gray-50"
                                }`}
                              >
                                {
                                  option
                                    .charAt(0)
                                    .toUpperCase() +
                                    option
                                      .slice(
                                        1,
                                      )
                                      .toLowerCase()
                                }
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

      {students.length > 0 && (
        <div className="flex justify-end border-t bg-gray-50 p-4">
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
              : "Save Attendance"}
          </button>
        </div>
      )}
    </div>
  );
}