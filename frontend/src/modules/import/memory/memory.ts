import { ImportField } from "@prisma/client";

import { prisma } from "@/lib/prisma";

/**
 * Find a previously learned header mapping for a school.
 */
export async function findMemoryMatch(
  schoolId: string,
  normalizedHeader: string,
): Promise<ImportField | null> {
  if (!schoolId || !normalizedHeader) {
    return null;
  }

  const memory =
    await prisma.importHeaderMemory.findUnique({
      where: {
        schoolId_normalizedHeader: {
          schoolId,
          normalizedHeader,
        },
      },
      select: {
        mappedField: true,
        confidence: true,
      },
    });

  if (!memory) {
    return null;
  }

  // Do not use weak/unknown learned mappings.
  if (
    memory.confidence < 90 ||
    memory.mappedField === ImportField.UNKNOWN
  ) {
    return null;
  }

  return memory.mappedField;
}

/**
 * Save or update a learned header mapping.
 *
 * Because (schoolId, normalizedHeader) is unique,
 * repeated imports update the existing memory instead
 * of creating duplicate records.
 */
export async function saveMemoryMatch({
  schoolId,
  originalHeader,
  normalizedHeader,
  mappedField,
  confidence,
}: {
  schoolId: string;
  originalHeader: string;
  normalizedHeader: string;
  mappedField: ImportField;
  confidence: number;
}): Promise<void> {
  if (
    !schoolId ||
    !originalHeader.trim() ||
    !normalizedHeader.trim()
  ) {
    return;
  }

  if (mappedField === ImportField.UNKNOWN) {
    return;
  }

  const safeConfidence = Math.max(
    0,
    Math.min(100, Math.round(confidence)),
  );

  await prisma.importHeaderMemory.upsert({
    where: {
      schoolId_normalizedHeader: {
        schoolId,
        normalizedHeader,
      },
    },

    create: {
      schoolId,
      originalHeader,
      normalizedHeader,
      mappedField,
      confidence: safeConfidence,
    },

    update: {
      originalHeader,
      mappedField,
      confidence: safeConfidence,
    },
  });
}