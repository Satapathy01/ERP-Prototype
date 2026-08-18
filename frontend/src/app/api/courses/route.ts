import { NextResponse } from "next/server";

import { prisma } from "~/lib/prisma";
import { getAuthenticationUser } from "~/modules/auth/auth.helper";

export async function GET() {
  try {
    const user = await getAuthenticationUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const courses = await prisma.course.findMany({
      where: {
        schoolId: user.schoolId,
        isActive: true,
      },

      select: {
        id: true,
        code: true,
        name: true,

        durationMonths: true,

        admissionFee: true,
        monthlyFee: true,
        certificateFee: true,
        totalFee: true,

        installmentCount: true,
      },

      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({
      success: true,

      data: courses.map((course) => ({
        id: course.id,
        code: course.code,
        name: course.name,

        durationMonths: course.durationMonths,

        admissionFee: Number(course.admissionFee),
        monthlyFee: Number(course.monthlyFee),
        certificateFee: Number(course.certificateFee),
        totalFee: Number(course.totalFee),

        installmentCount: course.installmentCount,
      })),
    });
  } catch (error) {
    console.error("Course fetch error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch courses.",
      },
      {
        status: 500,
      }
    );
  }
}