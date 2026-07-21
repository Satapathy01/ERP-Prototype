import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "@prisma/client";

import { getCurrentUser } from "~/modules/auth/current-user";
import { createUser, getUsers } from "~/modules/users/users.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get("page") ?? "1");
    const search = searchParams.get("search") ?? "";

    const result = await getUsers({
      page,
      search,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch users:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch users",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const user = await createUser({
      schoolId: currentUser.schoolId,
      name: body.name,
      email: body.email,
      password: body.password,
      role: body.role as UserRole,
      isActive: body.isActive,
    });

    return NextResponse.json(user, {
      status: 201,
    });
  } catch (error) {
    console.error("Failed to create user:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to create user",
      },
      {
        status: 400,
      }
    );
  }
}