import {
  MappedImportRow,
  ValidationIssue,
  ValidationResult,
} from "./types";

function isEmpty(value: unknown): boolean {
  return value === undefined || value === null || value === "";
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone);
}

function isValidAadhaar(aadhaar: string): boolean {
  return /^\d{12}$/.test(aadhaar);
}

function isValidDate(date?: Date): boolean {
  return !!date && !Number.isNaN(date.getTime());
}

export function validateStudent(
  student: MappedImportRow["student"]
): ValidationIssue[] {
  const errors: ValidationIssue[] = [];

  if (isEmpty(student.registrationNumber)) {
    errors.push({
      field: "registrationNumber",
      code: "REGISTRATION_REQUIRED",
      message: "Registration Number is required",
    });
  }

  if (isEmpty(student.name)) {
    errors.push({
      field: "name",
      code: "NAME_REQUIRED",
      message: "Student Name is required",
    });
  }

  if (student.email && !isValidEmail(student.email)) {
    errors.push({
      field: "email",
      code: "INVALID_EMAIL",
      message: "Invalid Email Address",
      value: student.email,
    });
  }

  if (student.phone && !isValidPhone(student.phone)) {
    errors.push({
      field: "phone",
      code: "INVALID_PHONE",
      message: "Invalid Phone Number",
      value: student.phone,
    });
  }

  if (
    student.aadhaarNumber &&
    !isValidAadhaar(student.aadhaarNumber)
  ) {
    errors.push({
      field: "aadhaarNumber",
      code: "INVALID_AADHAAR",
      message: "Invalid Aadhaar Number",
      value: student.aadhaarNumber,
    });
  }

  if (
    student.dateOfBirth &&
    !isValidDate(student.dateOfBirth)
  ) {
    errors.push({
      field: "dateOfBirth",
      code: "INVALID_DOB",
      message: "Invalid Date of Birth",
    });
  }

  return errors;
}

export function validateAdmission(
  admission: MappedImportRow["admission"]
): ValidationIssue[] {
  const errors: ValidationIssue[] = [];

  if (isEmpty(admission.course)) {
    errors.push({
      field: "course",
      code: "COURSE_REQUIRED",
      message: "Course is required",
    });
  }

  if (
    admission.admissionDate &&
    !isValidDate(admission.admissionDate)
  ) {
    errors.push({
      field: "admissionDate",
      code: "INVALID_ADMISSION_DATE",
      message: "Invalid Admission Date",
    });
  }

  return errors;
}

export function validatePayment(
  payment: MappedImportRow["payment"]
): ValidationIssue[] {
  const errors: ValidationIssue[] = [];

  if (
    payment.receiptDate &&
    !isValidDate(payment.receiptDate)
  ) {
    errors.push({
      field: "receiptDate",
      code: "INVALID_RECEIPT_DATE",
      message: "Invalid Receipt Date",
    });
  }

  if (
    payment.amountPaid !== undefined &&
    payment.amountPaid < 0
  ) {
    errors.push({
      field: "amountPaid",
      code: "INVALID_AMOUNT",
      message: "Amount Paid cannot be negative",
      value: payment.amountPaid,
    });
  }

  return errors;
}

export async function validateRow(
  row: MappedImportRow
): Promise<ValidationResult> {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  errors.push(...validateStudent(row.student));
  errors.push(...validateAdmission(row.admission));
  errors.push(...validatePayment(row.payment));

  if (isEmpty(row.student.fatherName)) {
    warnings.push({
      field: "fatherName",
      code: "FATHER_NAME_MISSING",
      message: "Father Name is missing",
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}