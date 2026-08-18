"use server";

import { revalidatePath } from "next/cache";

import {
  courseSchema,
  type CourseSchema,
} from "./schemas/course.schema";

import { courseService } from "./services/course.service";

interface UpdateCourseResult {
  success: boolean;
  message: string;
}

export async function updateCourse(
  id: string,
  schoolId: string,
  values: CourseSchema
): Promise<UpdateCourseResult> {
  const parsed = courseSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid course data.",
    };
  }

  const data = parsed.data;

  const existing = await courseService.getByCode(
    schoolId,
    data.code
  );

  if (existing && existing.id !== id) {
    return {
      success: false,
      message: "A course with this code already exists.",
    };
  }

  await courseService.update(id, data);

  revalidatePath("/dashboard/course");

  return {
    success: true,
    message: "Course updated successfully.",
  };
}