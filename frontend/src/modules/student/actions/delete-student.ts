"use server";

import { revalidatePath } from "next/cache";

import { deleteStudent as deleteStudentService } from "../student.service";
import { getAuthenticationUser } from "~/modules/auth/auth.helper";

export async function deleteStudent(id: string) {
  try {
    if (!id) {
      return {
        success: false,
        message: "Student ID is required.",
      };
    }

    const user = await getAuthenticationUser();

    if (!user) {
      return {
        success: false,
        message: "Unauthorized.",
      };
    }

    await deleteStudentService(
      id,
      user.schoolId,
    );

    revalidatePath(
      "/dashboard/people/students",
    );

    return {
      success: true,
      message: "Student deleted successfully.",
    };
  } catch (error) {
    console.error(
      "Delete student error:",
      error,
    );

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete student.",
    };
  }
}