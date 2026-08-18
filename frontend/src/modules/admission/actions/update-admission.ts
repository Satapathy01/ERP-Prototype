"use server";

import { revalidatePath } from "next/cache";

import { updateAdmissionSchema } from "../admission.schema";
import { updateAdmission } from "../admission.service";

export async function updateAdmissionAction(
  schoolId: string,
  admissionId: string,
  formData: unknown
) {
  const parsed = updateAdmissionSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const admission = await updateAdmission(
      schoolId,
      admissionId,
      parsed.data
    );

    revalidatePath("/dashboard/admissions");
    revalidatePath(`/dashboard/admissions/${admissionId}`);

    return {
      success: true,
      admission,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update admission.",
    };
  }
}