import { NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "~/modules/auth/current-user";

import {
  examRulesService,
} from "@/modules/exams/rules/exam-rules.service";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const schoolId =
      user.schoolId;

    if (!schoolId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "School ID is missing from authentication.",
        },
        { status: 400 },
      );
    }

    const rules =
      await examRulesService.getAll(
        schoolId,
      );

    return NextResponse.json({
      success: true,
      rules,
    });
  } catch (error) {
    console.error(
      "Get Exam Rules Error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to load examination rules.",
      },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const schoolId =
      user.schoolId;

    if (!schoolId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "School ID is missing from authentication.",
        },
        { status: 400 },
      );
    }

    const body =
      await request.json();

    const {
      name,
      description,
      rules,
      createdBy,
    } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Rule set name is required.",
        },
        { status: 400 },
      );
    }

    const ruleSet =
      await examRulesService.create({
        schoolId,

        name:
          name.trim(),

        description:
          description?.trim() ||
          undefined,

        rules,

        createdBy:
          createdBy ||
          user.id,
      });

    return NextResponse.json(
      {
        success: true,
        ruleSet,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "Create Exam Rule Error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create examination rule set.",
      },
      { status: 500 },
    );
  }
}