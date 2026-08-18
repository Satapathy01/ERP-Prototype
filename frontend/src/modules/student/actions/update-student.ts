"use server";

import { revalidatePath } from "next/cache";

import { updateStudent as updateStudentService } from "../student.service";
import type { CreateStudentInput } from "../student.schema";

export async function updateStudent(
  id: string,
  schoolId: string,
  data: CreateStudentInput
) {
  try {
    const student = await updateStudentService(id, schoolId, data);

    revalidatePath("/dashboard/people/students");

    return {
      success: true,
      message: "Student updated successfully.",
      student,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update student.",
    };
  }
}