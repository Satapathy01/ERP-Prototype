import { HeaderMatch, MappedImportRow } from "./types";
import { ImportField } from "@prisma/client";


function toString(value: unknown): string {
  return String(value).trim();
}

function toNumber(value: unknown): number {
  const num = Number(value);

  if (Number.isNaN(num)) {
    return 0;
  }

  return num;
}

function toDate(value: unknown): Date | undefined {
  if (!value) return undefined;

  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date;
}

export function mapRow(
  row: Record<string, unknown>,
  headers: HeaderMatch[]
): MappedImportRow {
  const mapped: MappedImportRow = {
    student: {},
    admission: {},
    payment: {},
  };

  for (const header of headers) {
    if (header.field === ImportField.UNKNOWN) {
      continue;
    }

    const value = row[header.original];

    if (
      value === undefined ||
      value === null ||
      value === ""
    ) {
      continue;
    }

    switch (header.field) {
      // -----------------------------
      // Student
      // -----------------------------
      case ImportField.REGISTRATION_NUMBER:
        mapped.student.registrationNumber = toString(value);
        break;

      case ImportField.STUDENT_NAME:
        mapped.student.name = toString(value);
        break;

      case ImportField.FATHER_NAME:
        mapped.student.fatherName = toString(value);
        break;

      case ImportField.MOTHER_NAME:
        mapped.student.motherName = toString(value);
        break;

      case ImportField.PHONE:
        mapped.student.phone = toString(value);
        break;

      case ImportField.EMAIL:
        mapped.student.email = toString(value);
        break;

      case ImportField.ADDRESS:
        mapped.student.address = toString(value);
        break;

      case ImportField.CITY:
        mapped.student.city = toString(value);
        break;

      case ImportField.STATE:
        mapped.student.state = toString(value);
        break;

      case ImportField.PIN_CODE:
        mapped.student.pinCode = toString(value);
        break;

      case ImportField.AADHAAR_NUMBER:
        mapped.student.aadhaarNumber = toString(value);
        break;

      case ImportField.GENDER:
        mapped.student.gender = toString(value);
        break;

      case ImportField.DATE_OF_BIRTH:
        mapped.student.dateOfBirth = toDate(value);
        break;

      // -----------------------------
      // Admission
      // -----------------------------
      case ImportField.COURSE:
        mapped.admission.course = toString(value);
        break;

      case ImportField.ADMISSION_DATE:
        mapped.admission.admissionDate = toDate(value);
        break;

      // -----------------------------
      // Payment
      // -----------------------------
      case ImportField.MR_NUMBER:
        mapped.payment.mrNumber = toString(value);
        break;

      case ImportField.RECEIPT_DATE:
        mapped.payment.receiptDate = toDate(value);
        break;

      case ImportField.AMOUNT_PAID:
        mapped.payment.amountPaid = toNumber(value);
        break;

      default:
        break;
    }
  }

  return mapped;
}