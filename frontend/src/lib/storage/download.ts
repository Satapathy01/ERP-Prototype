import { promises as fs } from "fs";
import path from "path";
import mime from "mime-types";

import { STORAGE_ROOT } from "./paths";

/**
 * Returns the absolute path of a stored file.
 */
export function getFilePath(
  relativePath: string
): string {
  return path.join(STORAGE_ROOT, relativePath);
}

/**
 * Reads a file into memory.
 */
export async function readFile(
  relativePath: string
): Promise<Buffer> {
  const fullPath = getFilePath(relativePath);

  return fs.readFile(fullPath);
}

/**
 * Returns file metadata.
 */
export async function getFileInfo(
  relativePath: string
) {
  const fullPath = getFilePath(relativePath);

  const stats = await fs.stat(fullPath);

  return {
    size: stats.size,
    createdAt: stats.birthtime,
    updatedAt: stats.mtime,
  };
}

/**
 * Returns MIME type.
 */
export function getMimeType(
  relativePath: string
): string {
  return (
    mime.lookup(relativePath) ||
    "application/octet-stream"
  );
}

/**
 * Checks if a file exists.
 */
export async function fileExists(
  relativePath: string
): Promise<boolean> {
  try {
    await fs.access(getFilePath(relativePath));
    return true;
  } catch {
    return false;
  }
}