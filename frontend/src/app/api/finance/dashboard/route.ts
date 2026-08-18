import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/modules/auth/jwt";

// ------------------------------------------------
// Get School Id
// ------------------------------------------------

async function getSchoolId(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const payload = await verifyToken(token);

  if (!payload) {
    throw new Error("Unauthorized");
  }

  return payload.schoolId;
}

export async function GET(request: NextRequest) {
  try {
    const schoolId = await getSchoolId(request);

    const now = new Date();

    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    const tomorrow = new Date(todayStart);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const monthStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
    );

    const [
      totalCollection,
      todayCollection,
      monthlyCollection,
    ] = await Promise.all([
      prisma.feePayment.aggregate({
        where: {
          admission: {
            schoolId,
          },
          status: "PAID",
        },
        _sum: {
          amountPaid: true,
        },
      }),

      prisma.feePayment.aggregate({
        where: {
          admission: {
            schoolId,
          },
          status: "PAID",
          receiptDate: {
            gte: todayStart,
            lt: tomorrow,
          },
        },
        _sum: {
          amountPaid: true,
        },
      }),

      prisma.feePayment.aggregate({
        where: {
          admission: {
            schoolId,
          },
          status: "PAID",
          receiptDate: {
            gte: monthStart,
          },
        },
        _sum: {
          amountPaid: true,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalCollection: Number(
          totalCollection._sum.amountPaid ?? 0,
        ),

        todayCollection: Number(
          todayCollection._sum.amountPaid ?? 0,
        ),

        monthlyCollection: Number(
          monthlyCollection._sum.amountPaid ?? 0,
        ),

        // TODO: Replace with real calculation after dues tracking is implemented
        pendingAmount: 0,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load dashboard.",
      },
      {
        status: 500,
      },
    );
  }
}