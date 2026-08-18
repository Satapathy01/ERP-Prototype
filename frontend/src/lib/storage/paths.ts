// src/lib/storage/paths.ts

import path from "path";

const STORAGE_ROOT =
  process.env.STORAGE_ROOT ??
  path.join(process.cwd(), "storage");

export { STORAGE_ROOT };

export const STORAGE_PATHS = {
  students: path.join(STORAGE_ROOT, "Students"),
  staff: path.join(STORAGE_ROOT, "Staff"),
  admissions: path.join(STORAGE_ROOT, "Admissions"),
  courses: path.join(STORAGE_ROOT, "Courses"),
  certificates: path.join(STORAGE_ROOT, "Certificates"),
  receipts: path.join(STORAGE_ROOT, "Receipts"),
  reports: path.join(STORAGE_ROOT, "Reports"),
  backups: path.join(STORAGE_ROOT, "Backups"),
} as const;

export const STUDENT_FOLDERS = {
  admission: "Admission",
  photos: "Photos",
  identity: "Identity",
  qualification: "Qualification",
  certificates: "Certificates",
  receipts: "Receipts",
  idCard: "IDCard",
} as const;

/**
 * Returns the root folder for a student.
 *
 * Example:
 * D:\TrainingInstitute\Students\REG260001
 */
export function getStudentRoot(registrationNumber: string) {
  return path.join(
    STORAGE_PATHS.students,
    registrationNumber
  );
}

/**
 * Returns a specific folder inside the student's directory.
 *
 * Example:
 * getStudentFolder("REG260001","Photos")
 */
export function getStudentFolder(
  registrationNumber: string,
  folder: keyof typeof STUDENT_FOLDERS
) {
  return path.join(
    getStudentRoot(registrationNumber),
    STUDENT_FOLDERS[folder]
  );
}