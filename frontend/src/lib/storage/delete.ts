import { promises as fs } from "fs";
import path from "path";

import { STORAGE_ROOT } from "./paths";

/**
 * Delete a single file.
 */
export async function deleteFile(
  relativePath: string,
): Promise<void> {
  const fullPath = path.join(
    STORAGE_ROOT,
    relativePath,
  );

  try {
    await fs.unlink(fullPath);
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code !== "ENOENT"
    ) {
      throw error;
    }
  }
}

/**
 * Delete a directory recursively.
 */
export async function deleteDirectory(
  relativePath: string,
): Promise<void> {
  const fullPath = path.join(
    STORAGE_ROOT,
    relativePath,
  );

  try {
    await fs.rm(fullPath, {
      recursive: true,
      force: true,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code !== "ENOENT"
    ) {
      throw error;
    }
  }
}

/**
 * Delete multiple files.
 */
export async function deleteFiles(
  relativePaths: string[],
): Promise<void> {
  await Promise.all(
    relativePaths.map((relativePath) =>
      deleteFile(relativePath),
    ),
  );
}