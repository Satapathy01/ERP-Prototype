import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

import { DocumentType, UploadResult } from "./types";
import { ensureDirectory } from "./storage";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

const ALLOWED_TYPES = [
  "application/pdf",

  "image/jpeg",
  "image/png",
  "image/webp",

  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export interface UploadFileOptions {
  folder: string;

  buffer: Buffer;

  originalName: string;

  mimeType: string;

  documentType: DocumentType;
}
export async function uploadFile({
  folder,
  buffer,
  originalName,
  mimeType,
  documentType,
}: UploadFileOptions): Promise<UploadResult> {
  if (!ALLOWED_TYPES.includes(mimeType)) {
    throw new Error("Unsupported file type.");
  }

  if (buffer.length > MAX_FILE_SIZE) {
    throw new Error("File exceeds 20 MB.");
  }

  const storageRoot = process.env.STORAGE_ROOT;

  if (!storageRoot) {
    throw new Error("STORAGE_ROOT is not configured.");
  }

  const targetFolder = path.join(storageRoot, folder);

  await ensureDirectory(targetFolder);

  const extension =
    path.extname(originalName) || ".bin";

  const fileName =
    `${documentType}_${randomUUID()}${extension}`;

  const absolutePath =
    path.join(targetFolder, fileName);

  await fs.writeFile(absolutePath, buffer);

  return {
    fileName,
    originalName,
    absolutePath,
    relativePath: path.join(folder, fileName),
    mimeType,
    extension,
    size: buffer.length,
    documentType,
  };
}