import { NextRequest, NextResponse } from "next/server";

import {
  examResultService,
} from "@/modules/exams/results/result.service";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const { id } =
      await context.params;

    const body =
      await request.json().catch(
        () => ({}),
      );

    const publishedBy =
      body?.publishedBy;

    const result =
      await examResultService.publish(
        id,
        publishedBy || undefined,
      );

    return NextResponse.json({
      success: true,
      result,
      message:
        "Exam result published successfully.",
    });
  } catch (error) {
    console.error(
      "Publish Exam Result Error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to publish examination result.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const { id } =
      await context.params;

    const result =
      await examResultService.unpublish(
        id,
      );

    return NextResponse.json({
      success: true,
      result,
      message:
        "Exam result unpublished successfully.",
    });
  } catch (error) {
    console.error(
      "Unpublish Exam Result Error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to unpublish examination result.",
      },
      { status: 500 },
    );
  }
}