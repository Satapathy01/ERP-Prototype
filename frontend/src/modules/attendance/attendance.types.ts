import type {
  AttendanceSource,
  AttendanceStatus,
} from "@prisma/client";

export type {
  AttendanceSource,
  AttendanceStatus,
};

export interface AttendanceStudent {
  id: string;
  name: string;
  registrationNumber: string;
  photoUrl?: string | null;
}

export interface AttendanceRecordData {
  id: string;

  studentId: string;

  courseId: string | null;
  batchId: string | null;

  campusEntryId: string | null;

  date: Date;

  status: AttendanceStatus;

  source: AttendanceSource;

  remarks: string | null;

  markedById: string | null;

  student: AttendanceStudent;

  createdAt: Date;
  updatedAt: Date;
}

export interface CampusEntryData {
  id: string;

  studentId: string;

  registrationNumber: string;

  scannedAt: Date;

  deviceId: string | null;

  gateName: string | null;

  student: AttendanceStudent;
}

export interface AttendanceSummary {
  totalStudents: number;

  present: number;

  absent: number;

  late: number;

  excused: number;

  percentage: number;
}