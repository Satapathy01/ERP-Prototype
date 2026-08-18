import { Gender, StudentStatus } from "@prisma/client";

export interface StudentFormData {
  name: string;

  fatherName?: string;
  motherName?: string;

  gender?: Gender;

  dateOfBirth?: Date;

  bloodGroup?: string;

  studentPhone?: string;
  parentPhone?: string;

  email?: string;

  address?: string;
  city?: string;
  state?: string;
  pinCode?: string;

  aadhaarNumber?: string;

  photoUrl?: string;

  status?: StudentStatus;
}