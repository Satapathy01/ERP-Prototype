"use server";

import { revalidatePath } from "next/cache";

import {
  createBatchSchema,
  type CreateBatchInput,
} from "../batch.schema";

import { createBatch } from "../batch.service";

export async function createBatchAction(
  schoolId: string,
  values: CreateBatchInput
) {
  const validated =
    createBatchSchema.parse(values);

  const batch = await createBatch(
    schoolId,
    validated
  );

  revalidatePath("/dashboard/batches");

  return batch;
}