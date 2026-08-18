import { ImportField } from "@prisma/client";

import { AIHeaderSuggestion } from "./types";

/**
 * Extract a JSON object from an Ollama response.
 *
 * Handles:
 * - Plain JSON
 * - JSON wrapped in ```json ... ```
 * - Extra text before/after the JSON object
 */
function extractJson(text: string): string {
  const trimmed = text.trim();

  if (!trimmed) {
    throw new Error(
      "Ollama returned an empty response.",
    );
  }

  // Remove Markdown code fences if present.
  const withoutFences = trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  // If the complete response is already JSON.
  if (
    withoutFences.startsWith("{") &&
    withoutFences.endsWith("}")
  ) {
    return withoutFences;
  }

  // Otherwise extract the first JSON object.
  const start = withoutFences.indexOf("{");
  const end = withoutFences.lastIndexOf("}");

  if (
    start === -1 ||
    end === -1 ||
    end <= start
  ) {
    throw new Error(
      "No JSON object found in AI response.",
    );
  }

  return withoutFences.substring(
    start,
    end + 1,
  );
}

/**
 * Check whether a value is a valid ImportField.
 */
function isImportField(
  value: unknown,
): value is ImportField {
  return (
    typeof value === "string" &&
    Object.values(ImportField).includes(
      value as ImportField,
    )
  );
}

/**
 * Parse and validate an Ollama header-matching response.
 */
export function parseAIResponse(
  response: string,
): AIHeaderSuggestion {
  const json = extractJson(response);

  let parsed: unknown;

  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error(
      "Invalid JSON returned by AI.",
    );
  }

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    Array.isArray(parsed)
  ) {
    throw new Error(
      "AI response must be a JSON object.",
    );
  }

  const obj =
    parsed as Record<string, unknown>;

  // --------------------------------------------------
  // Field
  // --------------------------------------------------

  if (!isImportField(obj.field)) {
    throw new Error(
      `Invalid ImportField returned by AI: ${String(
        obj.field,
      )}`,
    );
  }

  // Do not allow UNKNOWN to be treated as a successful
  // database-field mapping.
  if (obj.field === ImportField.UNKNOWN) {
    throw new Error(
      "AI could not determine a valid import field.",
    );
  }

  // --------------------------------------------------
  // Confidence
  // --------------------------------------------------

  let confidence = Number(
    obj.confidence,
  );

  if (!Number.isFinite(confidence)) {
    confidence = 0;
  }

  confidence = Math.max(
    0,
    Math.min(
      100,
      Math.round(confidence),
    ),
  );

  // --------------------------------------------------
  // Reasoning
  // --------------------------------------------------

  const reasoning =
    typeof obj.reasoning === "string"
      ? obj.reasoning.trim()
      : "";

  return {
    field: obj.field,
    confidence,
    reasoning,
  };
}