import { prisma } from "~/lib/prisma";
import type { CourseData } from "../schemas/course.schema";

export class CourseService {
  async getByCode(
    schoolId: string,
    code: string,
  ) {
    return prisma.course.findFirst({
      where: {
        schoolId,
        code,
      },
    });
  }

  async create(
    schoolId: string,
    data: CourseData,
  ) {
    const totalFee =
      data.admissionFee +
      data.monthlyFee *
        data.installmentCount -
      data.discount;

    return prisma.course.create({
      data: {
        schoolId,

        code: data.code,
        name: data.name,

        durationMonths:
          data.durationMonths,

        admissionFee:
          data.admissionFee,

        monthlyFee:
          data.monthlyFee,

        certificateFee:
          data.certificateFee,

        installmentCount:
          data.installmentCount,

        totalFee,

        isActive:
          data.isActive,
      },
    });
  }

  async getAll(
    schoolId: string,
  ) {
    return prisma.course.findMany({
      where: {
        schoolId,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getById(id: string) {
    return prisma.course.findUnique({
      where: {
        id,
      },
    });
  }

  async update(
    id: string,
    data: CourseData,
  ) {
    const totalFee =
      data.admissionFee +
      data.monthlyFee *
        data.installmentCount -
      data.discount;

    return prisma.course.update({
      where: {
        id,
      },

      data: {
        code: data.code,
        name: data.name,

        durationMonths:
          data.durationMonths,

        admissionFee:
          data.admissionFee,

        monthlyFee:
          data.monthlyFee,

        certificateFee:
          data.certificateFee,

        installmentCount:
          data.installmentCount,

        totalFee,

        isActive:
          data.isActive,
      },
    });
  }

  async delete(id: string) {
    return prisma.course.delete({
      where: {
        id,
      },
    });
  }
}

export const courseService =
  new CourseService();