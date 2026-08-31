import { UserRole } from "@prisma/client";
import { prisma } from "~/lib/prisma";

export async function getTeachers(schoolId: string) {
  return prisma.$transaction(async (tx) => {
    const users = await tx.user.findMany({
      where: {
        schoolId,
        isActive: true,
        role: { in: [UserRole.ADMIN, UserRole.STAFF] },
      },
      select: { id: true, name: true, email: true, role: true },
    });

    for (const user of users) {
      const existingTeacher = await tx.teacher.findFirst({
        where: { schoolId, email: user.email },
      });

      if (existingTeacher) {
        await tx.teacher.update({
          where: { id: existingTeacher.id },
          data: {
            name: user.name,
            email: user.email,
            status: "ACTIVE",
          },
        });
      } else {
        await tx.teacher.create({
          data: {
            schoolId,
            name: user.name,
            email: user.email,
            status: "ACTIVE",
            type: "FULL_TIME",
          },
        });
      }
    }

    const teachers = await tx.teacher.findMany({
      where: { schoolId, status: "ACTIVE" },
      select: { id: true, name: true, email: true, employeeCode: true },
      orderBy: { name: "asc" },
    });

    return teachers.map((teacher) => ({
      id: teacher.id,
      name: teacher.name,
      email: teacher.email,
      role: users.find((user) => teacher.email === user.email)?.role ?? null,
    }));
  });
}
