"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

export async function deleteManyCourses(ids: string[]) {
  try {
    if (ids.length === 0) {
      return {
        success: false,
        message: "No courses selected.",
      };
    }

    const result = await prisma.course.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    revalidatePath("/dashboard/courses");

    return {
      success: true,
      message: `${result.count} course${
        result.count === 1 ? "" : "s"
      } deleted successfully.`,
    };
  } catch (error) {
    console.error("Bulk delete courses error:", error);

    return {
      success: false,
      message: "Failed to delete selected courses.",
    };
  }
}