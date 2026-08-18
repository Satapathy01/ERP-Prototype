import { NextRequest, NextResponse } from "next/server";

import { getPaymentHistory } from "~/modules/finance/services/server";
import { verifyToken } from "~/modules/auth/jwt";

interface RouteContext {
  params: Promise<{
    admissionId: string;
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

    const { admissionId } = await params;

    const history = await getPaymentHistory(
      schoolId,
      admissionId,
    );

    return NextResponse.json({
      success: true,
      data: history,
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