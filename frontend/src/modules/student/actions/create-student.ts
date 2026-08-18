"use server";

import { revalidatePath } from "next/cache";

import { createStudent as createStudentService } from "../student.service";
import type { CreateStudentInput } from "../student.schema";

export async function createStudent(
  schoolId: string,
  data: CreateStudentInput
) {
  try {
    const student = await createStudentService(schoolId, data);

    revalidatePath("/dashboard/people/students");

    return {
      success: true,
      message: "Student created successfully.",
      student,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create student.",
    };
  }
}