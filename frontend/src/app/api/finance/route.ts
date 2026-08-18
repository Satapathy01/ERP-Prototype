import { NextRequest, NextResponse } from "next/server";

import {
  getFeePaymentsServer,
  createPaymentServer,
} from "~/modules/finance/services";

import { verifyToken } from "~/modules/auth/jwt";
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
// ----------------------------------------
// GET /api/finance
// ----------------------------------------

export async function GET(request: NextRequest) {
  try {
    const schoolId = await getSchoolId(request);

    const searchParams = request.nextUrl.searchParams;

    const query = {
      page: Number(searchParams.get("page") ?? "1"),
      limit: Number(searchParams.get("limit") ?? "10"),

      search: searchParams.get("search") ?? undefined,

      status: searchParams.get("status") ?? undefined,

      paymentMethod:
        searchParams.get("paymentMethod") ?? undefined,

      from: searchParams.get("from") ?? undefined,

      to: searchParams.get("to") ?? undefined,
    };

    const payments = await getFeePaymentsServer(
      schoolId,
      query,
    );

    return NextResponse.json({
      success: true,
      data: payments,
    });
  } catch (error) {
    console.error(error);

    if (
      error instanceof Error &&
      error.message === "Unauthorized"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
// ----------------------------------------
// POST /api/finance
// ----------------------------------------

export async function POST(request: NextRequest) {
  try {
    const schoolId = await getSchoolId(request);

    const body = await request.json();

    const payment = await createPaymentServer(
      schoolId,
      body,
    );

    return NextResponse.json(
      {
        success: true,
        message: "Payment created successfully.",
        data: payment,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(error);

    if (
      error instanceof Error &&
      error.message === "Unauthorized"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
