import {
  campusScanSchema,
  type CampusScanInput,
} from "./campus-entry.schema";

import {
  createCampusEntry,
  findRecentCampusEntry,
  findStudentByRegistrationNumber,
} from "../attendance.repository";

import {
  isDuplicateScan,
  normalizeRegistrationNumber,
} from "../attendance.helper";

/* -------------------------------------------------------------------------- */
/*                          Campus Entry Service                              */
/* -------------------------------------------------------------------------- */

export const campusEntryService = {
  /**
   * Process a student's campus barcode scan.
   *
   * Flow:
   *
   * Barcode
   *   ↓
   * Registration Number
   *   ↓
   * Find Student
   *   ↓
   * Check duplicate scan
   *   ↓
   * Create CampusEntry
   */
  async processScan(
    schoolId: string,
    input: CampusScanInput,
  ) {
    const parsed =
      campusScanSchema.safeParse(input);

    if (!parsed.success) {
      throw new Error(
        parsed.error.issues[0]?.message ??
          "Invalid campus scan.",
      );
    }

    const registrationNumber =
      normalizeRegistrationNumber(
        parsed.data.registrationNumber,
      );

    /* ---------------------------------------------------------------------- */
    /* Find student                                                          */
    /* ---------------------------------------------------------------------- */

    const student =
      await findStudentByRegistrationNumber(
        schoolId,
        registrationNumber,
      );

    if (!student) {
      throw new Error(
        "No student found with this registration number.",
      );
    }

    /* ---------------------------------------------------------------------- */
    /* Check duplicate scan                                                  */
    /* ---------------------------------------------------------------------- */

    const recentEntry =
      await findRecentCampusEntry(
        schoolId,
        student.id,
      );

    if (
      isDuplicateScan(
        recentEntry?.scannedAt,
      )
    ) {
      return {
        success: true,
        duplicate: true,
        message:
          "Student has already been scanned recently.",
        student,
        campusEntry: recentEntry,
      };
    }

    /* ---------------------------------------------------------------------- */
    /* Create campus entry                                                   */
    /* ---------------------------------------------------------------------- */

    const campusEntry =
      await createCampusEntry({
        schoolId,

        studentId:
          student.id,

        registrationNumber,

        deviceId:
          parsed.data.deviceId ??
          null,

        gateName:
          parsed.data.gateName ??
          null,
      });

    return {
      success: true,

      duplicate: false,

      message:
        "Campus entry recorded successfully.",

      student,

      campusEntry,
    };
  },

  /**
   * Get the student's recent campus
   * entry status.
   */
  async getStudentRecentEntry(
    schoolId: string,
    studentId: string,
  ) {
    return findRecentCampusEntry(
      schoolId,
      studentId,
    );
  },
};