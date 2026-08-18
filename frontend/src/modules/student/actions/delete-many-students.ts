"use server";

import { revalidatePath } from "next/cache";

import {
  deleteManyStudents as deleteManyStudentsService,
} from "../student.service";

import { getAuthenticationUser } from "~/modules/auth/auth.helper";

export async function deleteManyStudents(
  ids: string[],
) {
  try {
    if (!ids || ids.length === 0) {
      return {
        success: false,
        message: "No students selected.",
      };
    }

    const user = await getAuthenticationUser();

    if (!user) {
      return {
        success: false,
        message: "Unauthorized.",
      };
    }

    const result =
      await deleteManyStudentsService(
        ids,
        user.schoolId,
      );

    revalidatePath(
      "/dashboard/people/students",
    );

    return {
      success: true,
      count: result.count,
      message: `${result.count} student${
        result.count === 1 ? "" : "s"
      } deleted successfully.`,
    };
  } catch (error) {
    console.error(
      "Delete students error:",
      error,
    );

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete selected students.",
    };
  }
}