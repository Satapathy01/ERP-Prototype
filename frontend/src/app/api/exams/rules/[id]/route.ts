import { NextRequest, NextResponse } from "next/server";

import {
  examRulesService,
} from "@/modules/exams/rules/exam-rules.service";

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

    const ruleSet =
      await examRulesService.getById(id);

    if (!ruleSet) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Examination rule set not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      ruleSet,
    });
  } catch (error) {
    console.error(
      "Get Exam Rule Error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to load examination rule.",
      },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const { id } =
      await context.params;

    const body =
      await request.json();

    const {
      name,
      description,
    } = body;

    const ruleSet =
      await examRulesService.update(
        id,
        {
          name:
            name !== undefined
              ? name.trim()
              : undefined,

          description:
            description !== undefined
              ? description.trim()
              : undefined,
        },
      );

    return NextResponse.json({
      success: true,
      ruleSet,
    });
  } catch (error) {
    console.error(
      "Update Exam Rule Error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update examination rule.",
      },
      { status: 500 },
    );
  }
}