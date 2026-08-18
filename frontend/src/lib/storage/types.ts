// src/lib/storage/types.ts

import { DocumentType } from "@prisma/client";

export type { DocumentType };

export interface UploadResult {
  fileName: string;
  originalName: string;

  relativePath: string;
  absolutePath: string;

  mimeType: string;
  extension: string;

  size: number;

  documentType: DocumentType;
}

export interface StorageFolder {
  absolutePath: string;
  relativePath: string;
}

export interface StudentFolder {
  root: StorageFolder;

  admission: StorageFolder;

  photos: StorageFolder;

  identity: StorageFolder;

  qualification: StorageFolder;

  certificates: StorageFolder;

  receipts: StorageFolder;

  idCard: StorageFolder;
}