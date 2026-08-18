import type { StudentImportInput } from "./student-import.schema";

function parseDate(value: unknown): Date | null {
  if (!value) return null;

  if (value instanceof Date) return value;

  if (typeof value === "number") {
    return new Date(Math.round((value - 25569) * 86400 * 1000));
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    const parts = trimmed.split(".");
    if (parts.length === 3) {
      const [dd, mm, yyyy] = parts;
      const date = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
      return Number.isNaN(date.getTime()) ? null : date;
    }

    const date = new Date(trimmed);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  return null;
}

export function mapStudentImport(
  student: StudentImportInput,
  schoolId: string,
) {
  return {
    schoolId,
    registrationNumber: String(student["Reg.No"]).trim(),

    name: student["Name of Students"].trim(),

    fatherName: student["Father's Name"] ?? null,
    motherName: null,

    gender: undefined,

    dateOfBirth: parseDate(student["D.O.B"]),

    bloodGroup: null,

    studentPhone: null,
    parentPhone: null,

    email: null,

    address: null,
    city: null,
    state: null,
    pinCode: null,

    aadhaarNumber: null,

    photoUrl: null,

    status: "ACTIVE" as const,
  };
}

export function mapFeePaymentImport(
  student: StudentImportInput,
  studentId: string,
) {
  const amountRaw = student["Amt."] ?? student.Amt ?? null;

  const amount =
    amountRaw === null || amountRaw === undefined || amountRaw === ""
      ? null
      : Number(amountRaw);

  return {
    studentId,
    mrNumber: student["MR No"] ?? null,
    receiptDate: parseDate(student.Date),
    amountPaid:
      amount === null || Number.isNaN(amount) ? null : amount,
  };
}