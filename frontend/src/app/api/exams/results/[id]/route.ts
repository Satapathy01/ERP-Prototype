import { NextRequest, NextResponse } from "next/server";

import {
  examResultService,
} from "@/modules/exams/results/result.service";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const { id } =
      await context.params;

    const result =
      await examResultService.getById(id);

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Exam result not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error(
      "Get Exam Result Error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to load examination result.",
      },
      { status: 500 },
    );
  }
}