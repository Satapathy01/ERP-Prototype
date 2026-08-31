import { NextResponse } from "next/server";

import { getAuthenticationUser } from "~/modules/auth/auth.helper";
import { getBatches } from "~/modules/batch/batch.service";
import { createBatch } from "~/modules/batch/batch.service";
import { createBatchSchema } from "~/modules/batch/batch.schema";
import { updateBatch } from "~/modules/batch/batch.service";

export async function GET(request: Request) {
  try {
    const user = await getAuthenticationUser();

    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const courseId = new URL(request.url).searchParams.get("courseId") ?? undefined;
    const result = await getBatches({
      schoolId: user.schoolId,
      courseId,
      page: 1,
      pageSize: 500,
      isActive: true,
    });

    return NextResponse.json({ success: true, data: result.batches });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed to fetch batches." },
      { status: 400 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticationUser();

    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const input = createBatchSchema.parse({
      ...body,
      teacherId: body.teacherId || null,
    });
    const batch = await createBatch(user.schoolId, input);

    return NextResponse.json({ success: true, data: batch }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed to create batch." },
      { status: 400 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getAuthenticationUser();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, message: "Batch ID is required." }, { status: 400 });
    }

    const input = createBatchSchema.parse({
      ...body,
      teacherId: body.teacherId || null,
    });
    const batch = await updateBatch(body.id, user.schoolId, input);
    return NextResponse.json({ success: true, data: batch });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed to update batch." },
      { status: 400 },
    );
  }
}
