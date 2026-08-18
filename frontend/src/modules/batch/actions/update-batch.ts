"use server";

import { revalidatePath } from "next/cache";

import {
  updateBatchSchema,
  type UpdateBatchInput,
} from "../batch.schema";

import { updateBatch } from "../batch.service";

export async function updateBatchAction(
  id: string,
  schoolId: string,
  values: UpdateBatchInput
) {
  const validated =
    updateBatchSchema.parse(values);

  const batch = await updateBatch(
    id,
    schoolId,
    validated
  );

  revalidatePath("/dashboard/batches");

  return batch;
}