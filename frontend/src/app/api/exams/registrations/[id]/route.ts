import { NextRequest, NextResponse } from "next/server";

import {
  examRegistrationService,
} from "@/modules/exams/registration/registration.service";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET ONE REGISTRATION
 */
export async function GET(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const { id } =
      await context.params;

    const registration =
      await examRegistrationService.getById(
        id,
      );

    if (!registration) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Exam registration not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      registration,
    });
  } catch (error) {
    console.error(
      "Get Exam Registration Error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to load exam registration.",
      },
      { status: 500 },
    );
  }
}

/**
 * PUT
 *
 * Currently used for completing a registration.
 *
 * {
 *   action: "complete"
 * }
 */
export async function PUT(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const { id } =
      await context.params;

    const body =
      await request.json();

    const action =
      body?.action;

    if (action !== "complete") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Unsupported registration action.",
        },
        { status: 400 },
      );
    }

    const registration =
      await examRegistrationService.complete(
        id,
      );

    return NextResponse.json({
      success: true,
      registration,
    });
  } catch (error) {
    console.error(
      "Complete Exam Registration Error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to complete exam registration.",
      },
      { status: 500 },
    );
  }
}