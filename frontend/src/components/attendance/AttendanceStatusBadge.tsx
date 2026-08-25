import type { AttendanceStatus } from "@/modules/attendance/attendance.helper";

export function AttendanceStatusBadge({
  status,
}: {
  status: AttendanceStatus;
}) {
  const config = {
    PRESENT: {
      label: "Present",
      className:
        "bg-green-50 text-green-700 border-green-200",
    },
    ABSENT: {
      label: "Absent",
      className:
        "bg-red-50 text-red-700 border-red-200",
    },
    LATE: {
      label: "Late",
      className:
        "bg-yellow-50 text-yellow-700 border-yellow-200",
    },
    EXCUSED: {
      label: "Excused",
      className:
        "bg-blue-50 text-blue-700 border-blue-200",
    },
  } satisfies Record<
    AttendanceStatus,
    {
      label: string;
      className: string;
    }
  >;

  const item = config[status];

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${item.className}`}
    >
      {item.label}
    </span>
  );
}