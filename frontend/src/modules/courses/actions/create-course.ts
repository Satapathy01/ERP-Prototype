"use server";

import { revalidatePath } from "next/cache";

import {
  courseSchema,
  type CourseSchema,
} from "./schemas/course.schema";

import { courseService } from "./services/course.service";

interface CreateCourseResult {
  success: boolean;
  message: string;
}

export async function createCourse(
  schoolId: string,
  values: CourseSchema
): Promise<CreateCourseResult> {
  const parsed = courseSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid course data.",
    };
  }

  const data = parsed.data;

  const existingCourse = await courseService.getByCode(
    schoolId,
    data.code
  );

  if (existingCourse) {
    return {
      success: false,
      message: "A course with this code already exists.",
    };
  }

  await courseService.create(schoolId, data);

  revalidatePath("/dashboard/course");

  return {
    success: true,
    message: "Course created successfully.",
  };
}