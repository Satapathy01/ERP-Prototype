import * as attendanceRepository from "./attendance.repository";

import {
  attendanceQuerySchema,
  manualAttendanceSchema,
  classAttendanceSchema,
  campusEntrySchema,
  type AttendanceQuery,
  type ManualAttendanceInput,
  type ClassAttendanceInput,
  type CampusEntryInput,
} from "./attendance.schema";

/* -------------------------------------------------------------------------- */
/*                         Attendance Service                                 */
/* -------------------------------------------------------------------------- */

export const attendanceService = {
  /* ------------------------------------------------------------------------ */
  /*                            Attendance List                               */
  /* ------------------------------------------------------------------------ */

  async getAttendance(
    schoolId: string,
    query: AttendanceQuery,
  ) {
    const parsed =
      attendanceQuerySchema.parse(query);

    return attendanceRepository.getAttendance(
      schoolId,
      parsed,
    );
  },

  /* ------------------------------------------------------------------------ */
  /*                         Attendance History                               */
  /* ------------------------------------------------------------------------ */

  async getStudentHistory(
    schoolId: string,
    studentId: string,
  ) {
    return attendanceRepository.getStudentHistory(
      schoolId,
      studentId,
    );
  },

  /* ------------------------------------------------------------------------ */
  /*                          Daily Attendance                                */
  /* ------------------------------------------------------------------------ */

  async getDailyAttendance(
    schoolId: string,
    courseId: string,
    batchId: string,
    date: Date,
    sectionType?: "THEORY" | "PRACTICAL",
  ) {
    return attendanceRepository.getDailyAttendance(
      schoolId,
      courseId,
      batchId,
      sectionType,
      date,
    );
  },

  async getBatchStudents(
    schoolId: string,
    courseId: string,
    batchId: string,
    sectionType?: "THEORY" | "PRACTICAL",
    date?: Date,
  ) {
    return attendanceRepository.getBatchStudents(
      schoolId,
      courseId,
      batchId,
      sectionType,
      date,
    );
  },

  /* ------------------------------------------------------------------------ */
  /*                         Attendance Summary                                */
  /* ------------------------------------------------------------------------ */

  async getSummary(
    schoolId: string,
    options?: {
      studentId?: string;
      courseId?: string;
      batchId?: string;
      sectionType?: "THEORY" | "PRACTICAL";
      from?: Date;
      to?: Date;
    },
  ) {
    return attendanceRepository.getSummary(
      schoolId,
      options,
    );
  },

  async getDashboardSummary(schoolId: string) {
    return attendanceRepository.getDashboardSummary(schoolId);
  },

  /* ------------------------------------------------------------------------ */
  /*                         Manual Attendance                                */
  /* ------------------------------------------------------------------------ */

  async markManualAttendance(
    schoolId: string,
    markedById: string,
    data: ManualAttendanceInput,
  ) {
    const parsed =
      manualAttendanceSchema.parse(data);

    if (parsed.records.length === 0) {
      throw new Error(
        "At least one attendance record is required.",
      );
    }

    return attendanceRepository.markAttendance(
      schoolId,
      markedById,
      {
        ...parsed,
        source: "MANUAL",
      },
    );
  },

  /* ------------------------------------------------------------------------ */
  /*                          Class Attendance                                */
  /* ------------------------------------------------------------------------ */

  async markClassAttendance(
    schoolId: string,
    markedById: string,
    data: ClassAttendanceInput,
  ) {
    const parsed =
      classAttendanceSchema.parse(data);

    if (parsed.records.length === 0) {
      throw new Error(
        "At least one attendance record is required.",
      );
    }

    return attendanceRepository.markAttendance(
      schoolId,
      markedById,
      {
        ...parsed,
        source: "CLASS",
      },
    );
  },

  /* ------------------------------------------------------------------------ */
  /*                           Campus Scan                                    */
  /* ------------------------------------------------------------------------ */

  async registerCampusEntry(
    schoolId: string,
    data: CampusEntryInput,
  ) {
    const parsed =
      campusEntrySchema.parse(data);

    const registrationNumber =
      parsed.registrationNumber.trim();

    /*
     * Find the student using the registration
     * number within the authenticated school.
     */
    const student =
      await attendanceRepository.findStudentByRegistrationNumber(
        schoolId,
        registrationNumber,
      );

    if (!student) {
      throw new Error(
        "Student with this registration number was not found.",
      );
    }

    /*
     * Prevent accidental duplicate scans
     * within a short period.
     *
     * The repository decides whether a recent
     * scan exists.
     */
    const recentEntry =
      await attendanceRepository.findRecentCampusEntry(
        schoolId,
        student.id,
      );

    if (recentEntry) {
      return {
        duplicate: true,
        entry: recentEntry,
        student,
      };
    }

    /*
     * Record the physical campus entry.
     */
    const entry =
      await attendanceRepository.createCampusEntry({
        schoolId,

        studentId: student.id,

        registrationNumber:
          student.registrationNumber,

        deviceId:
          parsed.deviceId ?? null,

        gateName:
          parsed.gateName ?? null,
      });

    /*
     * Campus presence is separate from classroom
     * attendance.
     *
     * We intentionally do NOT create a CLASS
     * attendance record here.
     */
    return {
      duplicate: false,
      entry,
      student,
    };
  },

  /* ------------------------------------------------------------------------ */
  /*                          Campus History                                  */
  /* ------------------------------------------------------------------------ */

  async getCampusHistory(
    schoolId: string,
    options?: {
      studentId?: string;
      from?: Date;
      to?: Date;
      limit?: number;
    },
  ) {
    return attendanceRepository.getCampusHistory(
      schoolId,
      options,
    );
  },
};