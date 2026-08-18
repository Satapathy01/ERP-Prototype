"use server";

import { revalidatePath } from "next/cache";
import { courseService } from "./services/course.service";

interface DeleteCourseResult {
  success: boolean;
  message: string;
}

export async function deleteCourse(
  id: string,
): Promise<DeleteCourseResult> {
  try {
    const course = await courseService.getById(id);

    if (!course) {
      return {
        success: false,
        message: "Course not found.",
      };
    }

    await courseService.delete(id);

    revalidatePath("/dashboard/course");

    return {
      success: true,
      message: "Course deleted successfully.",
    };
  } catch (error) {
    console.error("Delete Course Error:", error);

    return {
      success: false,
      message:
        "Unable to delete this course. It may be referenced by other records.",
    };
  }
}