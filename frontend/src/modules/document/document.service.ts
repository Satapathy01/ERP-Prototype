// src/modules/document/document.service.ts

import { prisma } from "@/lib/prisma";
import {
  compressImage,
  uploadFile,
} from "@/lib/storage";

import { Document } from "@prisma/client";

import type { UploadDocumentInput } from "./document.types";

class DocumentService {
  /**
   * Upload a document and create its database record.
   */
  async uploadDocument(
    input: UploadDocumentInput
  ): Promise<Document> {
    let file = input.file;

    // Compress images before storing
    if (file.type.startsWith("image/")) {
      const compressed = await compressImage(
  Buffer.from(await file.arrayBuffer())
);

file = new File(
  [new Uint8Array(compressed)],
  file.name,
  {
    type: file.type,
    lastModified: Date.now(),
  }
);
    }

    const buffer = Buffer.from(
  await file.arrayBuffer()
);

const uploaded = await uploadFile({
  folder: input.folder,
  buffer,
  originalName: file.name,
  mimeType: file.type,
  documentType: input.type,
});
    return prisma.document.create({
      data: {
        schoolId: input.schoolId,

        studentId: input.studentId,

        admissionId: input.admissionId,

        feePaymentId: input.feePaymentId,

        uploadedBy: input.uploadedBy,

        type: input.type,

        title: input.title,

        originalName: uploaded.originalName,
        storedName: uploaded.fileName,

        relativePath: uploaded.relativePath,

        mimeType: uploaded.mimeType,
        extension: uploaded.extension,

        size: uploaded.size,
      },
    });
  }
}

export const documentService = new DocumentService();