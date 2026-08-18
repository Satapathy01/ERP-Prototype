"use server";

import { revalidatePath } from "next/cache";

import {
  deleteAdmission,
  restoreAdmission,
} from "../admission.service";

export async function deleteAdmissionAction(
  schoolId: string,
  admissionId: string
) {
  try {
    await deleteAdmission(schoolId, admissionId);

    revalidatePath("/dashboard/admissions");

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete admission.",
    };
  }
}

export async function restoreAdmissionAction(
  schoolId: string,
  admissionId: string
) {
  try {
    await restoreAdmission(schoolId, admissionId);

    revalidatePath("/dashboard/admissions");

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to restore admission.",
    };
  }
}