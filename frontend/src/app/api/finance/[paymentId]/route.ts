import { NextRequest, NextResponse } from "next/server";

import {
  getPayment,
  updatePayment,
  deletePayment,
} from "~/modules/finance/services/server";

import { verifyToken } from "~/modules/auth/jwt";

interface RouteContext {
  params: Promise<{
    paymentId: string;
  }>;
}
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
export async function GET(
  request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const schoolId = await getSchoolId(request);

    const { paymentId } = await params;

    const payment = await getPayment(
      paymentId,
      schoolId,
    );

    if (!payment) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment not found.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error(error);

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
// PUT /api/finance/:paymentId
// ----------------------------------------
export async function PUT(
  request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const schoolId = await getSchoolId(request);

    const { paymentId } = await params;

    const body = await request.json();

    const payment = await updatePayment(
      paymentId,
      schoolId,
      body,
    );

    return NextResponse.json({
      success: true,
      message: "Payment updated successfully.",
      data: payment,
    });
  } catch (error) {
    console.error(error);

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
// DELETE /api/finance/:paymentId
// ----------------------------------------
export async function DELETE(
  request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const schoolId = await getSchoolId(request);

    const { paymentId } = await params;

    await deletePayment(
      paymentId,
      schoolId,
    );

    return NextResponse.json({
      success: true,
      message: "Payment deleted successfully.",
    });
  } catch (error) {
    console.error(error);

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