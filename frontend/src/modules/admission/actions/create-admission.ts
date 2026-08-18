"use server";

import { revalidatePath } from "next/cache";

import { createAdmissionSchema } from "../admission.schema";
import { createAdmission } from "../admission.service";

export async function createAdmissionAction(
  schoolId: string,
  formData: unknown
) {
  const parsed = createAdmissionSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const admission = await createAdmission(
      schoolId,
      parsed.data
    );

    revalidatePath("/dashboard/admissions");

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
          : "Failed to create admission.",
    };
  }
}