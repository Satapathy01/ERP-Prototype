import { ImportField } from "@prisma/client";

import { aiMatchHeader } from "../ai";
import {
  findMemoryMatch,
  saveMemoryMatch,
} from "../memory/memory";

import { normalizeHeader } from "./header-normalizer";
import { HeaderMatch } from "./types";

/**
 * Detect the correct database field for an Excel header.
 *
 * Detection order:
 *
 * 1. Learned memory
 * 2. Ollama AI
 * 3. Unknown
 *
 * Local alias/fuzzy matching is intentionally not used.
 */
export async function detectHeader(
  header: string,
  schoolId: string,
): Promise<HeaderMatch> {
  const normalized = normalizeHeader(header);

  // --------------------------------------------------
  // Invalid header
  // --------------------------------------------------

  if (!normalized) {
    return {
      original: header,
      normalized,
      field: ImportField.UNKNOWN,
      confidence: 0,
      strategy: "unknown",
    };
  }

  // --------------------------------------------------
  // 1. Memory Match
  // --------------------------------------------------

  try {
    const memoryField = await findMemoryMatch(
      schoolId,
      normalized,
    );

    if (memoryField) {
      return {
        original: header,
        normalized,
        field: memoryField,
        confidence: 100,
        strategy: "manual",
      };
    }
  } catch (error) {
    console.error(
      "Header memory lookup failed:",
      error,
    );
  }

  // --------------------------------------------------
  // 2. Ollama AI Match
  // --------------------------------------------------

  try {
    const ai = await aiMatchHeader(
      header,
      Object.values(ImportField),
    );

    if (
      ai.success &&
      ai.suggestion &&
      !ai.rejected
    ) {
      const {
        field,
        confidence,
      } = ai.suggestion;

      // Never learn UNKNOWN.
      if (field !== ImportField.UNKNOWN) {
        /*
         * Only permanently learn strong AI matches.
         *
         * Lower-confidence matches can still be returned
         * to the importer but are not permanently learned.
         */
        if (ai.autoAccept) {
          try {
            await saveMemoryMatch({
              schoolId,
              originalHeader: header,
              normalizedHeader: normalized,
              mappedField: field,
              confidence,
            });
          } catch (error) {
            console.error(
              "Failed to save header memory:",
              error,
            );
          }
        }

        return {
          original: header,
          normalized,
          field,
          confidence,
          strategy: "ai",
        };
      }
    }

    // AI explicitly rejected the header.
    if (ai.rejected) {
      return {
        original: header,
        normalized,
        field: ImportField.UNKNOWN,
        confidence: 0,
        strategy: "unknown",
      };
    }
  } catch (error) {
    console.error(
      "AI Header Detection Failed:",
      error,
    );
  }

  // --------------------------------------------------
  // 3. Unknown
  // --------------------------------------------------

  return {
    original: header,
    normalized,
    field: ImportField.UNKNOWN,
    confidence: 0,
    strategy: "unknown",
  };
}

/**
 * Detect multiple Excel headers.
 */
export async function detectHeaders(
  headers: string[],
  schoolId: string,
): Promise<HeaderMatch[]> {
  return Promise.all(
    headers.map((header) =>
      detectHeader(header, schoolId),
    ),
  );
}