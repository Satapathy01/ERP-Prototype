"use server";

import { revalidatePath } from "next/cache";

import {
  deleteBatch,
  restoreBatch,
} from "../batch.service";

export async function deleteBatchAction(id: string) {
  await deleteBatch(id);

  revalidatePath("/dashboard/batches");
}

export async function restoreBatchAction(id: string) {
  await restoreBatch(id);

  revalidatePath("/dashboard/batches");
}