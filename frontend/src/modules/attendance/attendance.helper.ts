/* -------------------------------------------------------------------------- */
/*                          Attendance Helpers                                */
/* -------------------------------------------------------------------------- */

export type AttendanceStatus =
  | "PRESENT"
  | "ABSENT"
  | "LATE"
  | "EXCUSED";

/* -------------------------------------------------------------------------- */
/*                              Date Helpers                                  */
/* -------------------------------------------------------------------------- */

/**
 * Returns the beginning of a day.
 */
export function startOfDay(
  date: Date = new Date(),
): Date {
  const result = new Date(date);

  result.setHours(
    0,
    0,
    0,
    0,
  );

  return result;
}

/**
 * Returns the end of a day.
 */
export function endOfDay(
  date: Date = new Date(),
): Date {
  const result = new Date(date);

  result.setHours(
    23,
    59,
    59,
    999,
  );

  return result;
}

/**
 * Checks whether two dates belong to
 * the same calendar day.
 */
export function isSameDay(
  first: Date,
  second: Date,
): boolean {
  return (
    startOfDay(first).getTime() ===
    startOfDay(second).getTime()
  );
}

/* -------------------------------------------------------------------------- */
/*                        Attendance Percentage                              */
/* -------------------------------------------------------------------------- */

/**
 * Calculate attendance percentage.
 *
 * PRESENT and LATE count as attended.
 */
export function calculateAttendancePercentage(
  present: number,
  total: number,
): number {
  if (total <= 0) {
    return 0;
  }

  return Number(
    (
      (present / total) *
      100
    ).toFixed(2),
  );
}

/**
 * Calculate attendance percentage
 * from attendance statuses.
 */
export function calculatePercentageFromStatuses(
  statuses: AttendanceStatus[],
): number {
  if (statuses.length === 0) {
    return 0;
  }

  const attended =
    statuses.filter(
      (status) =>
        status === "PRESENT" ||
        status === "LATE",
    ).length;

  return calculateAttendancePercentage(
    attended,
    statuses.length,
  );
}

/* -------------------------------------------------------------------------- */
/*                         Attendance Summary                                 */
/* -------------------------------------------------------------------------- */

export interface AttendanceSummary {
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  percentage: number;
}

/**
 * Build an attendance summary from
 * a list of attendance statuses.
 */
export function buildAttendanceSummary(
  statuses: AttendanceStatus[],
): AttendanceSummary {
  const total = statuses.length;

  const present =
    statuses.filter(
      (status) =>
        status === "PRESENT",
    ).length;

  const absent =
    statuses.filter(
      (status) =>
        status === "ABSENT",
    ).length;

  const late =
    statuses.filter(
      (status) =>
        status === "LATE",
    ).length;

  const excused =
    statuses.filter(
      (status) =>
        status === "EXCUSED",
    ).length;

  const percentage =
    calculateAttendancePercentage(
      present + late,
      total,
    );

  return {
    total,
    present,
    absent,
    late,
    excused,
    percentage,
  };
}

/* -------------------------------------------------------------------------- */
/*                        Eligibility Helpers                                */
/* -------------------------------------------------------------------------- */

/**
 * Check whether a student has reached
 * the required attendance percentage.
 */
export function meetsAttendanceRequirement(
  attendancePercentage: number,
  minimumPercentage: number,
): boolean {
  return (
    attendancePercentage >=
    minimumPercentage
  );
}

/**
 * Return the attendance percentage
 * rounded to two decimal places.
 */
export function normalizePercentage(
  percentage: number,
): number {
  return Number(
    percentage.toFixed(2),
  );
}

/* -------------------------------------------------------------------------- */
/*                           Status Helpers                                  */
/* -------------------------------------------------------------------------- */

/**
 * Determine whether a status counts
 * as attendance.
 */
export function isAttendedStatus(
  status: AttendanceStatus,
): boolean {
  return (
    status === "PRESENT" ||
    status === "LATE"
  );
}

/**
 * Determine whether a student is absent.
 */
export function isAbsentStatus(
  status: AttendanceStatus,
): boolean {
  return status === "ABSENT";
}

/**
 * Determine whether a student was
 * excused from attendance.
 */
export function isExcusedStatus(
  status: AttendanceStatus,
): boolean {
  return status === "EXCUSED";
}

/* -------------------------------------------------------------------------- */
/*                         Campus Scan Helpers                               */
/* -------------------------------------------------------------------------- */

/**
 * Prevent duplicate campus scans within
 * a configurable time window.
 */
export function isDuplicateScan(
  lastScannedAt: Date | null | undefined,
  now: Date = new Date(),
  windowMinutes = 2,
): boolean {
  if (!lastScannedAt) {
    return false;
  }

  const difference =
    now.getTime() -
    lastScannedAt.getTime();

  return (
    difference >= 0 &&
    difference <
      windowMinutes *
        60 *
        1000
  );
}

/**
 * Validate a registration number
 * received from a barcode/QR scanner.
 */
export function normalizeRegistrationNumber(
  registrationNumber: string,
): string {
  return registrationNumber
    .trim()
    .toUpperCase();
}

/* -------------------------------------------------------------------------- */
/*                     Attendance Source Helpers                              */
/* -------------------------------------------------------------------------- */

export type AttendanceSource =
  | "MANUAL"
  | "CLASS"
  | "CAMPUS_SCAN";

/**
 * Human-readable attendance source.
 */
export function getAttendanceSourceLabel(
  source: AttendanceSource,
): string {
  switch (source) {
    case "MANUAL":
      return "Manual";

    case "CLASS":
      return "Class Attendance";

    case "CAMPUS_SCAN":
      return "Campus Scan";

    default:
      return source;
  }
}

/* -------------------------------------------------------------------------- */
/*                        Attendance Status Label                             */
/* -------------------------------------------------------------------------- */

export function getAttendanceStatusLabel(
  status: AttendanceStatus,
): string {
  switch (status) {
    case "PRESENT":
      return "Present";

    case "ABSENT":
      return "Absent";

    case "LATE":
      return "Late";

    case "EXCUSED":
      return "Excused";

    default:
      return status;
  }
}

/* -------------------------------------------------------------------------- */
/*                       Attendance Status Color                              */
/* -------------------------------------------------------------------------- */

export function getAttendanceStatusClass(
  status: AttendanceStatus,
): string {
  switch (status) {
    case "PRESENT":
      return "text-green-600";

    case "ABSENT":
      return "text-red-600";

    case "LATE":
      return "text-yellow-600";

    case "EXCUSED":
      return "text-blue-600";

    default:
      return "text-gray-600";
  }
}

/* -------------------------------------------------------------------------- */
/*                         Attendance Rule Check                              */
/* -------------------------------------------------------------------------- */

/**
 * Check whether attendance satisfies
 * an examination eligibility rule.
 */
export function checkAttendanceEligibility(
  attendancePercentage: number,
  minimumPercentage: number,
) {
  const eligible =
    meetsAttendanceRequirement(
      attendancePercentage,
      minimumPercentage,
    );

  return {
    eligible,
    attendancePercentage:
      normalizePercentage(
        attendancePercentage,
      ),
    minimumPercentage,
    shortfall: eligible
      ? 0
      : normalizePercentage(
          minimumPercentage -
            attendancePercentage,
        ),
  };
}