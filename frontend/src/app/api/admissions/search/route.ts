import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/modules/auth/jwt";

export async function GET(req: NextRequest) {
  try {
    // ---------------------------------------------
    // Authentication
    // ---------------------------------------------

    const token = req.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);

    if (!payload?.schoolId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const schoolId = payload.schoolId;

    // ---------------------------------------------
    // Search
    // ---------------------------------------------

    const q =
      req.nextUrl.searchParams.get("q")?.trim() ?? "";

    if (q.length < 2) {
      return NextResponse.json([]);
    }

    // ---------------------------------------------
    // Find Admissions
    // ---------------------------------------------

    const admissions = await prisma.admission.findMany({
      where: {
        schoolId,
        isActive: true,

        OR: [
          {
            student: {
              name: {
                contains: q,
                mode: "insensitive",
              },
            },
          },
          {
            student: {
              registrationNumber: {
                contains: q,
                mode: "insensitive",
              },
            },
          },
        ],
      },

      include: {
        // -----------------------------------------
        // Student
        // -----------------------------------------

        student: {
          select: {
            id: true,
            name: true,
            registrationNumber: true,
            photoUrl: true,
          },
        },

        // -----------------------------------------
        // Course + Fee Schedules
        // -----------------------------------------

        course: {
          include: {
            feeSchedules: {
              where: {
                isActive: true,
              },

              orderBy: {
                dueOrder: "asc",
              },

              select: {
                id: true,
                title: true,
                amount: true,
                dueOrder: true,
                isMandatory: true,
                isActive: true,
              },
            },
          },
        },

        // -----------------------------------------
        // Batch + Teacher
        // -----------------------------------------

        batch: {
          include: {
            teacher: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },

      orderBy: {
        admissionDate: "desc",
      },

      take: 10,
    });

    // ---------------------------------------------
    // Convert Prisma Decimal / DateTime values
    // ---------------------------------------------

    const result = admissions.map((admission) => ({
      // -----------------------------------------
      // Admission
      // -----------------------------------------

      id: admission.id,

      barcode: admission.barcode,

      admissionDate:
        admission.admissionDate.toISOString(),

      admissionFee: Number(
        admission.admissionFee
      ),

      monthlyFee: Number(
        admission.monthlyFee
      ),

      certificateFee: Number(
        admission.certificateFee
      ),

      totalFee: Number(
        admission.totalFee
      ),

      discount: Number(
        admission.discount
      ),

      session: admission.session,

      batchName: admission.batchName,

      trainerName: admission.trainerName,

      expectedCompletionDate:
        admission.expectedCompletionDate
          ? admission.expectedCompletionDate.toISOString()
          : null,

      // -----------------------------------------
      // Student
      // -----------------------------------------

      student: {
        id: admission.student.id,
        name: admission.student.name,
        registrationNumber:
          admission.student.registrationNumber,
        photoUrl:
          admission.student.photoUrl,
      },

      // -----------------------------------------
      // Course
      // -----------------------------------------

      course: {
  id: admission.course.id,
  code: admission.course.code,
  name: admission.course.name,

  durationMonths: admission.course.durationMonths,
  installmentCount: admission.course.installmentCount,

  monthlyFee: Number(admission.course.monthlyFee),
  admissionFee: Number(admission.course.admissionFee),
  certificateFee: Number(
    admission.course.certificateFee
  ),
  totalFee: Number(
    admission.course.totalFee
  ),

  feeSchedules:
    admission.course.feeSchedules.map(
      (schedule) => ({
        id: schedule.id,
        title: schedule.title,
        amount: Number(schedule.amount),
        dueOrder: schedule.dueOrder,
        isMandatory: schedule.isMandatory,
        isActive: schedule.isActive,
      })
    ),
},

      // -----------------------------------------
      // Batch
      // -----------------------------------------

      batch: admission.batch
        ? {
            id: admission.batch.id,

            name: admission.batch.name,

            startTime:
              admission.batch.startTime,

            endTime:
              admission.batch.endTime,

            startDate:
              admission.batch.startDate
                ? admission.batch.startDate.toISOString()
                : null,

            endDate:
              admission.batch.endDate
                ? admission.batch.endDate.toISOString()
                : null,

            teacher:
              admission.batch.teacher
                ? {
                    id:
                      admission.batch.teacher.id,

                    name:
                      admission.batch.teacher.name,
                  }
                : null,
          }
        : null,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error(
      "Admission search error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to search admissions",
      },
      {
        status: 500,
      }
    );
  }
}